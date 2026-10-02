import { Controller, Get, NotFoundException, Param, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RequirePermission } from '../auth/permissions.decorator';
import { AuditQuery, AuditService } from './audit.service';

/** Read-only by design: there is no route to edit or delete audit entries. */
@Controller('admin/audit')
@UseGuards(JwtAuthGuard)
@RequirePermission('audit.view')
export class AuditController {
  constructor(private readonly audit: AuditService) {}

  @Get()
  list(@Query() query: AuditQuery) {
    return this.audit.list(query);
  }

  @Get('filters')
  filters() {
    return this.audit.filters();
  }

  @Get(':id')
  async get(@Param('id') id: string) {
    const entry = await this.audit.get(id);
    if (!entry) throw new NotFoundException('Entry not found.');
    return entry;
  }
}
