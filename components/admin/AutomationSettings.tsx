'use client'

export default function AutomationSettings() {
  return (
    <div className="space-y-6">
      <section className="bg-white rounded-lg shadow-md p-6 space-y-3">
        <h2 className="text-xl font-bold text-gray-800">⚙️ Automation overview</h2>
        <p className="text-sm text-gray-600">
          There are no hidden background jobs in this project. Automations depend entirely on the cron jobs and external services you connect. Use this page as a living runbook for what you have enabled.
        </p>
        <table className="w-full text-sm text-gray-600">
          <thead className="bg-gray-50 text-gray-700">
            <tr>
              <th className="text-left py-2 px-3">Workflow</th>
              <th className="text-left py-2 px-3">Trigger</th>
              <th className="text-left py-2 px-3">Status</th>
              <th className="text-left py-2 px-3">Notes</th>
            </tr>
          </thead>
          <tbody>
            <AutomationRow
              name="Deal refresh"
              trigger="Vercel Cron (7:30 AM / 7:30 PM ET)"
              status={process.env.NEXT_PUBLIC_CRON_SECRET ? 'Configured' : 'Pending'}
              notes="Calls POST /api/deals/refresh to regenerate curated inventory."
            />
            <AutomationRow
              name="Email digest"
              trigger="Mailchimp automation"
              status={process.env.NEXT_PUBLIC_MAILCHIMP_STATUS === 'connected' ? 'Configured' : 'Optional'}
              notes="Powered by /api/subscribe fallback. Configure campaigns in your ESP."
            />
            <AutomationRow
              name="Social posts"
              trigger="Zapier / Make"
              status="Manual setup"
              notes="Use the endpoints listed in the Social Media tab to auto-post top deals."
            />
          </tbody>
        </table>
      </section>

      <section className="bg-white rounded-lg shadow-md p-6 space-y-3">
        <h3 className="text-lg font-semibold text-gray-800">⏱️ Suggested schedule</h3>
        <ul className="list-disc pl-6 space-y-2 text-sm text-gray-600">
          <li><strong>07:30 AM ET</strong> — refresh deals.</li>
          <li><strong>08:00 AM ET</strong> — send email digest (if connected).</li>
          <li><strong>Every 3 hours</strong> — publish a social update (manual or automated).</li>
          <li><strong>Weekly (Mon)</strong> — publish a long-form roundup article.</li>
        </ul>
      </section>

      <section className="bg-white rounded-lg shadow-md p-6 space-y-3">
        <h3 className="text-lg font-semibold text-gray-800">🛡️ Alerting</h3>
        <p className="text-sm text-gray-600">
          Use your deployment platform to configure alerts. For example, set up Slack/email notifications for Vercel Cron failures or monitor the logs for `/api/deals/refresh` in your logging provider.
        </p>
      </section>
    </div>
  )
}

function AutomationRow({ name, trigger, status, notes }: { name: string; trigger: string; status: string; notes: string }) {
  return (
    <tr className="border-b last:border-none">
      <td className="py-2 px-3 text-gray-800 font-medium">{name}</td>
      <td className="py-2 px-3">{trigger}</td>
      <td className="py-2 px-3">
        <span className="inline-flex items-center px-2 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-semibold">
          {status}
        </span>
      </td>
      <td className="py-2 px-3 text-gray-600">{notes}</td>
    </tr>
  )
}
