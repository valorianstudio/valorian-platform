/**
 * The API wraps every JSON success as { success: true, data } and every failure as { success: false, message }.
 * `unwrap` accepts both the envelope and a bare payload, so a web deploy and an API deploy can roll out in either order.
 */
export function unwrap<T = unknown>(payload: unknown): T {
  if (payload && typeof payload === 'object' && 'success' in payload && (payload as { success: unknown }).success === true && 'data' in payload) {
    return (payload as { data: T }).data;
  }
  return payload as T;
}
