import { useState } from 'react'

// 线上构建时用 VITE_WEBHOOK_URL 注入公网隧道地址；本地开发默认回落到 localhost
const WEBHOOK_URL = import.meta.env.VITE_WEBHOOK_URL || 'http://localhost:5678/webhook/lead'

function BoltIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M13 2 3 14h7l-1 8 10-12h-7l1-8z" />
    </svg>
  )
}

function CheckIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  )
}

function PhoneIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  )
}

function BellIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </svg>
  )
}

function TableIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M3 9h18M3 15h18M9 3v18M15 3v18" />
    </svg>
  )
}

function Spinner({ className }) {
  return (
    <svg className={'animate-spin ' + (className || '')} viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-90" fill="currentColor" d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4z" />
    </svg>
  )
}

const features = [
  { icon: <BoltIcon className="w-5 h-5" />, title: '30 秒自动回复', desc: '客户提交后立即收到确认，不错过任何一条线索' },
  { icon: <BellIcon className="w-5 h-5" />, title: '实时通知老板', desc: '飞书群即时弹送新线索，手机随时掌握' },
  { icon: <TableIcon className="w-5 h-5" />, title: '线索自动沉淀', desc: '每条线索自动记入表格，后续跟进一目了然' },
]

export default function App() {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [need, setNeed] = useState('')
  const [status, setStatus] = useState('idle') // idle | loading | success | error
  const [message, setMessage] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    if (!name.trim() || !phone.trim()) return
    setStatus('loading')
    setMessage('')
    try {
      const resp = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          need: need.trim() || '咨询',
        }),
      })
      const data = await resp.json()
      if (data.success) {
        setStatus('success')
        setMessage(data.message)
        setName('')
        setPhone('')
        setNeed('')
      } else {
        throw new Error(data.message || '提交失败')
      }
    } catch (err) {
      setStatus('error')
      setMessage(err.message || '网络异常')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-emerald-50 text-slate-800 relative overflow-hidden">
      {/* 装饰光斑 */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-sky-300/30 rounded-full blur-3xl animate-float-slow" />
      <div className="absolute top-40 -right-32 w-[28rem] h-[28rem] bg-emerald-200/40 rounded-full blur-3xl animate-float-slow" style={{ animationDelay: '2s' }} />
      <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-cyan-200/30 rounded-full blur-3xl" />

      <div className="relative max-w-5xl mx-auto px-5 py-12 md:py-16">
        {/* 品牌 */}
        <header className="flex items-center justify-between mb-10 md:mb-14">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-sky-500 to-emerald-500 flex items-center justify-center text-white shadow-lg shadow-sky-500/30">
              <BoltIcon className="w-6 h-6" />
            </div>
            <div>
              <div className="font-bold text-lg tracking-wide text-slate-900">线索秒回</div>
              <div className="text-xs text-slate-500">自动获客演示</div>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-white/70 backdrop-blur border border-emerald-200/60 text-sm text-emerald-700">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            系统在线
          </div>
        </header>

        <div className="grid md:grid-cols-2 gap-10 items-center">
          {/* 左侧文案 */}
          <div className="animate-fade-up">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-100 text-sky-700 text-xs font-medium mb-5">
              <BoltIcon className="w-3.5 h-3.5" />
              自动化 · 零漏单 · 秒响应
            </div>
            <h1 className="text-3xl md:text-[2.6rem] leading-tight font-bold text-slate-900 mb-4">
              留一条需求，
              <br />
              <span className="bg-gradient-to-r from-sky-600 to-emerald-600 bg-clip-text text-transparent">
                30 秒内自动回复
              </span>
            </h1>
            <p className="text-slate-500 leading-relaxed mb-8 max-w-md">
              客户在页面填表，系统自动回执、实时提醒老板、线索自动入档——把「等客户」变成「系统抢客户」。
            </p>
            <div className="space-y-4">
              {features.map((f) => (
                <div key={f.title} className="flex gap-3 items-start">
                  <div className="mt-0.5 w-9 h-9 shrink-0 rounded-xl bg-white shadow-sm border border-slate-100 text-sky-600 flex items-center justify-center">
                    {f.icon}
                  </div>
                  <div>
                    <div className="font-semibold text-slate-800">{f.title}</div>
                    <div className="text-sm text-slate-500">{f.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 右侧表单 */}
          <div className="animate-fade-up" style={{ animationDelay: '0.15s' }}>
            <div className="rounded-3xl bg-white/80 backdrop-blur-xl shadow-2xl shadow-sky-900/10 border border-white/70 p-7 md:p-8">
              <h2 className="text-xl font-bold text-slate-900 mb-1">留下您的需求</h2>
              <p className="text-sm text-slate-500 mb-6">提交后 30 秒内收到自动回复，我们会第一时间联系您。</p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5" htmlFor="name">
                    您的称呼 <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="怎么称呼您？"
                    required
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white/90 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-400/60 focus:border-transparent transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5" htmlFor="phone">
                    联系电话 <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <PhoneIcon className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="方便联系的手机号"
                      pattern="[0-9]{6,15}"
                      required
                      className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 bg-white/90 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-400/60 focus:border-transparent transition"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5" htmlFor="need">
                    您想咨询什么？
                  </label>
                  <textarea
                    id="need"
                    value={need}
                    onChange={(e) => setNeed(e.target.value)}
                    placeholder="例如：网站改版报价 / 小程序开发 / 自动化系统搭建…"
                    rows="3"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white/90 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-400/60 focus:border-transparent transition resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-sky-500 to-emerald-500 text-white font-semibold text-base shadow-lg shadow-sky-500/30 hover:shadow-xl hover:shadow-sky-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-60 disabled:hover:translate-y-0 flex items-center justify-center gap-2"
                >
                  {status === 'loading' ? (
                    <>
                      <Spinner className="w-5 h-5" /> 提交中…
                    </>
                  ) : (
                    <>提交需求</>
                  )}
                </button>
              </form>

              {status === 'success' && (
                <div className="mt-5 rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-emerald-800 text-sm leading-relaxed animate-fade-up">
                  <div className="flex items-center gap-2 font-semibold mb-1">
                    <span className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                      <CheckIcon className="w-3 h-3" />
                    </span>
                    提交成功
                  </div>
                  {message}
                </div>
              )}
              {status === 'error' && (
                <div className="mt-5 rounded-xl bg-rose-50 border border-rose-200 p-4 text-rose-800 text-sm leading-relaxed animate-fade-up">
                  <div className="font-semibold mb-1">提交失败</div>
                  {message}
                  <div className="mt-1 text-rose-600/80 text-xs">请确认服务已启动，稍后再试。</div>
                </div>
              )}
            </div>
          </div>
        </div>

        <footer className="mt-14 text-center text-xs text-slate-400 space-y-1">
          <p>演示环境 · 数据通过自动化工作流实时处理</p>
          <p>© 2026 线索秒回 · 自动化获客服务</p>
        </footer>
      </div>
    </div>
  )
}
