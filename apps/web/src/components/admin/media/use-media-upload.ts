'use client';

import { useCallback } from 'react';
import { useToast } from '@/components/ui/toast';
import { ApiError, replaceMedia, uploadMedia } from '@/lib/client-api';
import type { MediaFolder, UploadedMedia } from '@/lib/client-api';

const shorten = (name: string) => (name.length > 28 ? `${name.slice(0, 18)}…${name.slice(-8)}` : name);

interface UploadRequest {
  file: File;
  folder?: MediaFolder;
  /** Swap the file behind this library item instead of creating a new one. */
  replaceId?: string;
  signal?: AbortSignal;
  /** Called with 0-100 so a form can draw its own progress bar next to the toast. */
  onProgress?: (percent: number) => void;
}

/**
 * One upload flow for every screen: a live progress notification ("Uploading… 85%"), then a clear success or error.
 * Resolves with the stored media, or rejects with the ApiError after the error toast has been shown.
 */
export function useMediaUpload() {
  const toast = useToast();

  return useCallback(
    async ({ file, folder, replaceId, signal, onProgress }: UploadRequest): Promise<UploadedMedia> => {
      const verb = replaceId ? 'Replacing' : 'Uploading';
      const notice = toast.loading(`${verb} ${shorten(file.name)}…`, 0);
      const report = (percent: number) => {
        onProgress?.(percent);
        notice.update(percent < 100 ? `${verb} ${shorten(file.name)}…` : 'Processing image…', percent);
      };
      try {
        const media = replaceId ? await replaceMedia(replaceId, file, { signal, onProgress: report }) : await uploadMedia(file, { folder, signal, onProgress: report });
        notice.success(replaceId ? 'Image replaced successfully.' : 'Image uploaded successfully.');
        return media;
      } catch (error) {
        const failure = error instanceof ApiError ? error : new ApiError('Upload failed. Please try again.', 0);
        if (failure.message === 'Upload cancelled.') notice.dismiss();
        else notice.error(failure.message);
        throw failure;
      }
    },
    [toast],
  );
}
