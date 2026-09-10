import { useEffect, useMemo, useState } from "react"
import { Bell, Check, CircleCheck, MessageSquare, Users, X } from "lucide-react"
import { clsx } from "clsx"
import { apiFetch } from "../api"

type NotificationType = "status_change" | "confirmation" | "resolved" | "rejected" | "system"

interface NotificationItem {
  id: number
  type: NotificationType
  title: string
  subtitle: string | null
  is_read: boolean
  created_at: string
}

const iconStyles: Record<string, string> = {
  status_change:  "bg-[#DBEAFE] text-info",
  confirmation:   "bg-[#FEF3C7] text-warning",
  resolved:       "bg-[#DCFCE7] text-success",
  rejected:       "bg-[#FEE2E2] text-danger",
  system:         "bg-[#F3F4F6] text-ink-muted",
}

function NotificationIcon({ type }: { type: string }) {
  const className = "w-4 h-4"
  if (type === "resolved")     return <Check className={className} />
  if (type === "rejected")     return <X className={className} />
  if (type === "confirmation") return <Users className={className} />
  if (type === "system")       return <Bell className={className} />
  if (type === "status_change") return <CircleCheck className={className} />
  return <MessageSquare className={className} />
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const mins  = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days  = Math.floor(diff / 86400000)
  if (mins < 60)  return `${mins}m ago`
  if (hours < 24) return `${hours}h ago`
  return `${days}d ago`
}

export function Notifications() {
  const [filter, setFilter] = useState<"All" | "Unread" | "Read">("All")
  const [notifications, setNotifications] = useState<NotificationItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    apiFetch('/api/notifications')
      .then(r => r.json())
      .then(data => {
        setNotifications(Array.isArray(data.notifications) ? data.notifications : [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const markAllAsRead = async () => {
    await apiFetch('/api/notifications/read-all', { method: 'PATCH' })
    setNotifications(items => items.map(item => ({ ...item, is_read: true })))
  }

  const markOneRead = async (id: number) => {
    await apiFetch(`/api/notifications/${id}/read`, { method: 'PATCH' })
    setNotifications(items => items.map(item => item.id === id ? { ...item, is_read: true } : item))
  }

  const visible = useMemo(() => {
    if (filter === "Unread") return notifications.filter(n => !n.is_read)
    if (filter === "Read")   return notifications.filter(n => n.is_read)
    return notifications
  }, [filter, notifications])

  return (
    <div className="w-full max-w-[1200px]">
      <div className="mb-5 flex items-end justify-between gap-4 border-b border-line">
        <div className="flex items-center gap-6">
          {(["All", "Unread", "Read"] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setFilter(tab)}
              className={clsx(
                "border-b-2 pb-3 text-sm transition-colors",
                filter === tab ? "border-accent font-semibold text-navy" : "border-transparent font-normal text-ink-muted hover:text-navy",
              )}
            >
              {tab}
            </button>
          ))}
        </div>
        <button type="button" onClick={markAllAsRead} className="mb-3 text-sm font-medium text-navy hover:underline">
          Mark all as read
        </button>
      </div>

      <div className="overflow-hidden rounded-[10px] border border-line bg-white shadow-sm">
        {loading ? (
          <div className="flex min-h-72 flex-col items-center justify-center">
            <p className="text-sm text-ink-muted">Loading…</p>
          </div>
        ) : visible.length === 0 ? (
          <div className="flex min-h-72 flex-col items-center justify-center px-6 text-center">
            <Bell className="mb-4 h-10 w-10 text-ink-muted" />
            <p className="text-[15px] font-semibold text-ink">No notifications yet</p>
            <p className="mt-1 text-[13px] text-ink-muted">You'll be notified when your reports are updated.</p>
          </div>
        ) : (
          visible.map((item, index) => (
            <div
              key={item.id}
              onClick={() => !item.is_read && markOneRead(item.id)}
              className={clsx(
                "flex min-h-[72px] gap-3 px-5 py-4 transition-colors hover:bg-page-bg/40 cursor-pointer",
                index !== visible.length - 1 && "border-b border-line",
              )}
            >
              <div className="flex w-2 shrink-0 items-start pt-2">
                {!item.is_read && <span className="h-2 w-2 rounded-full bg-accent" />}
              </div>
              <div className={clsx("mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full", iconStyles[item.type] ?? iconStyles.system)}>
                <NotificationIcon type={item.type} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-ink">{item.title}</p>
                {item.subtitle && (
                  <p className="mt-1 truncate text-[13px] text-ink-muted">{item.subtitle}</p>
                )}
                {item.type === "resolved" && (
                  <button type="button" className="mt-2 text-xs font-medium text-success hover:underline">Leave Feedback</button>
                )}
              </div>
              <time className="shrink-0 pt-0.5 text-right text-xs text-ink-muted">{timeAgo(item.created_at)}</time>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
