import { Transform } from 'class-transformer';
import { IsBoolean, IsEmail, IsIn, IsNotEmpty, IsOptional, IsString, IsUrl, Matches, MaxLength } from 'class-validator';

const emptyToNull = ({ value }: { value: unknown }): unknown => {
  if (typeof value !== 'string') return value;
  const trimmed = value.trim();
  return trimmed === '' ? null : trimmed;
};
const trim = ({ value }: { value: unknown }): unknown => (typeof value === 'string' ? value.trim() : value);
const url = { require_protocol: true, protocols: ['http', 'https'] };

export const SUPPORTED_CURRENCIES = ['USD', 'EUR', 'GBP', 'BDT', 'INR', 'AED', 'CAD', 'AUD'] as const;

export class UpdateSiteSettingsDto {
  @Transform(trim) @IsString() @IsNotEmpty() @MaxLength(60)
  brandName: string;

  @Transform(trim) @IsString() @IsNotEmpty() @MaxLength(100)
  companyName: string;

  @Transform(trim) @IsString() @IsNotEmpty() @MaxLength(120)
  tagline: string;

  @Transform(trim) @IsString() @IsNotEmpty() @MaxLength(500)
  description: string;

  @Transform(trim) @IsEmail()
  primaryEmail: string;

  @Transform(emptyToNull) @IsOptional() @IsEmail()
  secondaryEmail?: string | null;

  @Transform(emptyToNull) @IsOptional() @Matches(/^\+?[0-9 ()-]{6,24}$/, { message: 'phone must be a valid phone number' })
  phone?: string | null;

  @Transform(emptyToNull) @IsOptional() @Matches(/^\+?[0-9]{6,20}$/, { message: 'whatsapp must contain digits only, with optional leading +' })
  whatsapp?: string | null;

  @Transform(emptyToNull) @IsOptional() @IsUrl(url) @MaxLength(200)
  websiteUrl?: string | null;

  @Transform(emptyToNull) @IsOptional() @IsString() @MaxLength(120)
  location?: string | null;

  @Transform(emptyToNull) @IsOptional() @IsUrl(url) @MaxLength(200)
  linkedinUrl?: string | null;

  @Transform(emptyToNull) @IsOptional() @IsUrl(url) @MaxLength(200)
  githubUrl?: string | null;

  @Transform(emptyToNull) @IsOptional() @IsUrl(url) @MaxLength(200)
  facebookUrl?: string | null;

  @Transform(emptyToNull) @IsOptional() @IsUrl(url) @MaxLength(200)
  instagramUrl?: string | null;

  @Transform(emptyToNull) @IsOptional() @IsUrl(url) @MaxLength(200)
  twitterUrl?: string | null;

  @IsIn(SUPPORTED_CURRENCIES)
  defaultCurrency: string;

  @Transform(emptyToNull) @IsOptional() @IsUrl(url) @MaxLength(500)
  logoLightUrl?: string | null;

  @Transform(emptyToNull) @IsOptional() @IsUrl(url) @MaxLength(500)
  logoDarkUrl?: string | null;

  @Transform(emptyToNull) @IsOptional() @IsUrl(url) @MaxLength(500)
  faviconUrl?: string | null;

  @IsBoolean()
  maintenanceMode: boolean;
}
