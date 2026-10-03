import Link from 'next/link';
import { Empty, BarList, DataTable, Delta, Funnel, Money, Panel, StatCard, TrendChart, formatMoney, formatNumber, formatPercent } from './widgets';
import type { AcquisitionData, ContentData, EntityRow, EstimatorData, OverviewData, SalesData } from './types';

const CHANNEL_LABEL: Record<string, string> = {
  DIRECT: 'Direct',
  ORGANIC_SEARCH: 'Organic search',
  SOCIAL: 'Social',
  REFERRAL: 'Referral',
  PAID: 'Paid campaigns',
  UNKNOWN: 'Unknown / other',
  UNATTRIBUTED: 'Unattributed',
};
const STAGE_LABEL: Record<string, string> = { NEW: 'New', CONTACTED: 'Contacted', QUALIFIED: 'Qualified', MEETING: 'Meeting', PROPOSAL: 'Proposal', NEGOTIATION: 'Negotiation', WON: 'Won', LOST: 'Lost' };
const PLATFORM_LABEL: Record<string, string> = { WEBSITE: 'Website', MOBILE: 'Mobile app', BOTH: 'Website + mobile' };
const label = (map: Record<string, string>, key: string) => map[key] ?? key;
const rate = (a: number, b: number) => (b > 0 ? Math.round((a / b) * 1000) / 10 : null);

export function OverviewSection({ data }: { data: OverviewData }) {
  const { current, previous } = data;
  const quiet = current.visitors === 0 && current.pageViews === 0;
  const conversion = rate(current.leads, current.visitors);

  return (
    <div className="space-y-6">
      {quiet && <p className="rounded-xl border border-dashed border-border px-5 py-4 text-sm text-muted">Analytics will appear after visitors begin using the site. Lead and pipeline figures below come from your CRM and are already live.</p>}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Unique sessions" value={formatNumber(current.visitors)} hint="Anonymous browsing sessions, not individual people."><Delta current={current.visitors} previous={previous.visitors} /></StatCard>
        <StatCard label="Page views" value={formatNumber(current.pageViews)}><Delta current={current.pageViews} previous={previous.pageViews} /></StatCard>
        <StatCard label="Leads" value={formatNumber(current.leads)}><Delta current={current.leads} previous={previous.leads} /></StatCard>
        <StatCard label="Lead conversion" value={formatPercent(conversion)} hint="Leads ÷ unique sessions." />
        <StatCard label="Estimates generated" value={formatNumber(current.estimatorCompletions)} hint={`${formatPercent(rate(current.estimatorCompletions, current.estimatorStarts))} of ${formatNumber(current.estimatorStarts)} starts`}><Delta current={current.estimatorCompletions} previous={previous.estimatorCompletions} /></StatCard>
        <StatCard label="Pipeline value" value={<Money values={data.pipeline.total} />} hint="Active leads, midpoint of each estimate." />
        <StatCard label="Won value" value={<Money values={data.won.values.map((v) => ({ currency: v.currency, total: v.total }))} />} hint={`${data.won.count} won in period`} />
        <StatCard label="Overdue follow-ups" value={formatNumber(data.followUps.overdue)} hint={`${data.followUps.dueToday} due today`} />
      </div>
      <Panel title="Traffic over time" description="Daily unique sessions and page views.">
        {quiet ? <Empty>No traffic recorded in this period yet.</Empty> : <TrendChart points={data.series} />}
      </Panel>
    </div>
  );
}

export function AcquisitionSection({ data }: { data: AcquisitionData }) {
  return (
    <div className="space-y-6">
      {data.totalSessions === 0 && <Empty>Traffic sources will appear after visitors begin using the site.</Empty>}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Panel title="Channels" description="How sessions found the site. Unknown and unattributed traffic is shown separately, not guessed.">
          <BarList items={data.channels.map((c) => ({ label: label(CHANNEL_LABEL, c.channel), value: c.sessions, detail: c.leads ? `${c.leads} ${c.leads === 1 ? 'lead' : 'leads'}` : undefined }))} />
          {data.unattributedLeads > 0 && <p className="mt-4 text-xs text-muted">{data.unattributedLeads} {data.unattributedLeads === 1 ? 'lead has' : 'leads have'} no traffic attribution (for example, older leads or blocked analytics).</p>}
        </Panel>
        <Panel title="Top sources">
          <DataTable rows={data.sources} rowKey={(r) => `${r.source}-${r.channel}`} columns={[{ header: 'Source', cell: (r) => r.source }, { header: 'Channel', cell: (r) => label(CHANNEL_LABEL, r.channel) }, { header: 'Sessions', align: 'right', cell: (r) => formatNumber(r.sessions) }]} />
        </Panel>
        <Panel title="UTM campaigns" description="Sessions that arrived with a utm_campaign parameter.">
          <DataTable rows={data.campaigns} rowKey={(r) => `${r.campaign}-${r.source}-${r.medium}`} columns={[{ header: 'Campaign', cell: (r) => r.campaign }, { header: 'Source / medium', cell: (r) => [r.source, r.medium].filter(Boolean).join(' / ') || '—' }, { header: 'Sessions', align: 'right', cell: (r) => formatNumber(r.sessions) }]} />
        </Panel>
        <Panel title="Referrers">
          <BarList items={data.referrers.map((r) => ({ label: r.host, value: r.sessions }))} tone="accent" />
        </Panel>
      </div>
    </div>
  );
}

function EntityTable({ rows, showPlatform, showLeads = true }: { rows: EntityRow[]; showPlatform?: boolean; showLeads?: boolean }) {
  return (
    <DataTable
      rows={rows}
      rowKey={(r) => r.id}
      columns={[
        { header: 'Name', cell: (r) => <span className="font-medium">{r.name}</span> },
        { header: 'Views', align: 'right', cell: (r) => formatNumber(r.views) },
        { header: 'Sessions', align: 'right', cell: (r) => formatNumber(r.sessions) },
        { header: 'CTA clicks', align: 'right', cell: (r) => formatNumber(r.clicks ?? 0) },
        ...(showPlatform ? [{ header: 'Web / mobile', align: 'right' as const, cell: (r: EntityRow) => `${r.website ?? 0} / ${r.mobile ?? 0}` }] : []),
        ...(showLeads ? [{ header: 'Leads', align: 'right' as const, cell: (r: EntityRow) => formatNumber(r.leads ?? 0) }] : []),
      ]}
    />
  );
}

export function ContentSection({ data }: { data: ContentData }) {
  const interest = data.platformInterest;
  const total = interest.website + interest.mobile;
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Panel title="Top pages"><DataTable rows={data.pages} rowKey={(r) => r.path} columns={[{ header: 'Page', cell: (r) => <code className="break-all text-xs">{r.path}</code> }, { header: 'Views', align: 'right', cell: (r) => formatNumber(r.views) }, { header: 'Sessions', align: 'right', cell: (r) => formatNumber(r.sessions) }]} /></Panel>
        <Panel title="Demo platform interest" description="Which platform tab visitors select on demo pages.">
          {total === 0 ? <Empty>No platform selections yet.</Empty> : <BarList items={[{ label: 'Website', value: interest.website, detail: formatPercent(rate(interest.website, total)) }, { label: 'Mobile app', value: interest.mobile, detail: formatPercent(rate(interest.mobile, total)) }]} tone="accent" />}
        </Panel>
      </div>
      <Panel title="Top demos" description="Leads are counted from submissions that came from the demo."><EntityTable rows={data.demos} showPlatform /></Panel>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Panel title="Top services"><EntityTable rows={data.services} /></Panel>
        <Panel title="Top industries" description="Leads come from demos in the industry."><EntityTable rows={data.solutions} /></Panel>
        <Panel title="Top case studies"><EntityTable rows={data.caseStudies} showLeads={false} /></Panel>
        <Panel title="Top articles" description="CTA clicks count visits to contact, estimator and WhatsApp from the article."><EntityTable rows={data.articles} showLeads={false} /></Panel>
      </div>
    </div>
  );
}

export function EstimatorSection({ data }: { data: EstimatorData }) {
  const started = data.funnel[0]?.count ?? 0;
  return (
    <div className="space-y-6">
      {started === 0 && data.funnel[3]?.count === 0 && <Empty>Estimator analytics will appear after visitors use the estimator.</Empty>}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.4fr_1fr]">
        <Panel title="Estimator funnel" description="Distinct sessions reaching each step.">
          <Funnel stages={data.funnel} />
          <dl className="mt-5 grid grid-cols-2 gap-4 border-t border-border pt-4 text-sm">
            <div><dt className="text-muted">Completion rate</dt><dd className="text-xl font-semibold">{formatPercent(data.completionRate)}</dd><dd className="text-xs text-muted">Estimates ÷ starts</dd></div>
            <div><dt className="text-muted">Estimate → lead</dt><dd className="text-xl font-semibold">{formatPercent(data.leadConversion)}</dd><dd className="text-xs text-muted">Leads ÷ estimates</dd></div>
          </dl>
        </Panel>
        <Panel title="Estimated project value" description="From stored estimates, never recalculated with current prices.">
          {data.values.length === 0 ? <Empty /> : (
            <ul className="space-y-4">
              {data.values.map((v) => (
                <li key={v.currency}>
                  <p className="text-xs font-medium text-muted">{v.currency} · {v.count} {v.count === 1 ? 'estimate' : 'estimates'}</p>
                  <p className="text-2xl font-semibold tabular-nums">{formatMoney(v.average, v.currency)} <span className="text-sm font-normal text-muted">average</span></p>
                  <p className="text-sm text-muted">Median {formatMoney(v.median, v.currency)} · Total {formatMoney(v.total, v.currency)}</p>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Panel title="Project types"><BarList items={data.projectTypes.map((r) => ({ label: r.label, value: r.count }))} /></Panel>
        <Panel title="Platform"><BarList items={data.platforms.map((r) => ({ label: label(PLATFORM_LABEL, r.label), value: r.count }))} tone="accent" /></Panel>
        <Panel title="Complexity"><BarList items={data.complexity.map((r) => ({ label: r.label, value: r.count }))} /></Panel>
        <Panel title="Expected users"><BarList items={data.scale.map((r) => ({ label: r.label, value: r.count }))} tone="accent" /></Panel>
        <Panel title="Timeline preference"><BarList items={data.urgency.map((r) => ({ label: r.label, value: r.count }))} /></Panel>
        <Panel title="Most selected features" description="Excludes features included in every estimate."><BarList items={data.features.map((r) => ({ label: r.label, value: r.count }))} tone="accent" /></Panel>
        <Panel title="Most selected integrations"><BarList items={data.integrations.map((r) => ({ label: r.label, value: r.count }))} /></Panel>
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {([['Value by project type', data.valueByType], ['Value by industry', data.valueByIndustry], ['Value by lead source', data.valueBySource]] as const).map(([title, rows]) => (
          <Panel key={title} title={title} description="Average estimate.">
            <DataTable rows={[...rows]} rowKey={(r) => `${r.label}-${r.currency}`} columns={[{ header: 'Group', cell: (r) => label(CHANNEL_LABEL, r.label) }, { header: 'Count', align: 'right', cell: (r) => r.count }, { header: 'Average', align: 'right', cell: (r) => formatMoney(r.average, r.currency) }]} />
          </Panel>
        ))}
      </div>
    </div>
  );
}

export function SalesSection({ data }: { data: SalesData }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Leads in period" value={formatNumber(data.totalLeads)} />
        <StatCard label="Pipeline value" value={<Money values={data.pipeline.total} />} hint="All active opportunities now; Lost leads excluded." />
        <StatCard label="Won" value={formatNumber(data.won.count)} hint={data.won.values.length ? `Total ${data.won.values.map((v) => formatMoney(v.total, v.currency)).join(' · ')}` : 'No won value recorded'} />
        <StatCard label="Lost" value={formatNumber(data.lost)} hint={data.averageDeal.length ? `Average deal ${data.averageDeal.map((v) => formatMoney(v.average, v.currency)).join(' · ')}` : undefined} />
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.3fr_1fr]">
        <Panel title="Lead pipeline" description="Leads created in this period, by their current stage.">
          <BarList items={data.stages.map((s) => ({ label: label(STAGE_LABEL, s.status), value: s.count }))} />
        </Panel>
        <Panel title="Conversion" description="Share of leads created in the period that have reached each stage (Lost leads are not counted as progressed).">
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between"><dt className="text-muted">Lead → qualified</dt><dd className="font-semibold">{formatPercent(data.rates.qualified)}</dd></div>
            <div className="flex justify-between"><dt className="text-muted">Lead → proposal</dt><dd className="font-semibold">{formatPercent(data.rates.proposal)}</dd></div>
            <div className="flex justify-between"><dt className="text-muted">Lead → won</dt><dd className="font-semibold">{formatPercent(data.rates.won)}</dd></div>
          </dl>
        </Panel>
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Panel title="Pipeline by stage" description="Active opportunities, midpoint of estimates.">
          <DataTable rows={data.pipeline.stages} rowKey={(r) => r.status} columns={[{ header: 'Stage', cell: (r) => label(STAGE_LABEL, r.status) }, { header: 'Leads', align: 'right', cell: (r) => r.count }, { header: 'Value', align: 'right', cell: (r) => <Money values={r.totals} /> }]} />
        </Panel>
        <Panel title="Follow-ups" description="Active leads only.">
          <dl className="grid grid-cols-2 gap-4 text-sm">
            {([['Overdue', data.followUps.overdue, '/admin/leads?followUp=overdue'], ['Due today', data.followUps.dueToday, '/admin/leads?followUp=today'], ['Next 7 days', data.followUps.thisWeek, '/admin/leads?followUp=upcoming'], ['No follow-up set', data.followUps.withoutFollowUp, '/admin/leads']] as const).map(([name, value, href]) => (
              <div key={name}><dt className="text-muted">{name}</dt><dd className="text-2xl font-semibold tabular-nums"><Link href={href} className="hover:text-primary">{value}</Link></dd></div>
            ))}
            <div className="col-span-2"><dt className="text-muted">Idle for {data.followUps.idleDays}+ days</dt><dd className="text-2xl font-semibold tabular-nums">{data.followUps.idle}</dd></div>
          </dl>
        </Panel>
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Panel title="Leads by source"><DataTable rows={data.bySource} rowKey={(r) => r.label} columns={[{ header: 'Source', cell: (r) => r.label.charAt(0) + r.label.slice(1).toLowerCase() }, { header: 'Leads', align: 'right', cell: (r) => r.leads }, { header: 'Won', align: 'right', cell: (r) => r.won }, { header: 'Lost', align: 'right', cell: (r) => r.lost }]} /></Panel>
        <Panel title="Leads by traffic channel" description="Unattributed means no analytics session was linked to the lead."><DataTable rows={data.byChannel} rowKey={(r) => r.label} columns={[{ header: 'Channel', cell: (r) => label(CHANNEL_LABEL, r.label) }, { header: 'Leads', align: 'right', cell: (r) => r.leads }, { header: 'Won', align: 'right', cell: (r) => r.won }]} /></Panel>
        <Panel title="Demo conversion" description="Lead rate = leads ÷ demo views. Small samples are not conclusive."><DataTable rows={data.demos} rowKey={(r) => r.id} columns={[{ header: 'Demo', cell: (r) => r.name }, { header: 'Views', align: 'right', cell: (r) => r.views }, { header: 'Est. clicks', align: 'right', cell: (r) => r.estimateClicks }, { header: 'Leads', align: 'right', cell: (r) => r.leads }, { header: 'Lead rate', align: 'right', cell: (r) => formatPercent(r.leadRate) }]} /></Panel>
        <Panel title="Service conversion" description="Lead rate = leads ÷ service views."><DataTable rows={data.services} rowKey={(r) => r.id} columns={[{ header: 'Service', cell: (r) => r.name }, { header: 'Views', align: 'right', cell: (r) => r.views }, { header: 'Leads', align: 'right', cell: (r) => r.leads }, { header: 'Lead rate', align: 'right', cell: (r) => formatPercent(r.leadRate) }]} /></Panel>
        <Panel title="UTM campaigns" className="lg:col-span-2"><DataTable rows={data.byCampaign} rowKey={(r) => `${r.label}-${r.source}`} columns={[{ header: 'Campaign', cell: (r) => r.label }, { header: 'Source', cell: (r) => r.source || '—' }, { header: 'Leads', align: 'right', cell: (r) => r.leads }, { header: 'Won', align: 'right', cell: (r) => r.won }]} /></Panel>
      </div>
    </div>
  );
}
