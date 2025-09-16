// app/vite-app/page.jsx (for app directory)
// OR pages/vite-app.jsx (for pages directory)

export default function ViteAppPage() {
  return (
    <div style={{ width: '100%', height: '100vh', margin: 0, padding: 0 }}>
      <iframe 
        src="http://localhost:5173"
        width="100%" 
        height="100%"
        style={{ border: 'none' }}
        title="Vite App"
      />
    </div>
  )
}