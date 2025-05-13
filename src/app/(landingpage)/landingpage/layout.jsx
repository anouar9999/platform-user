// app/(no-layout)/layout.jsx
// Empty layout that just returns children without any wrapper
export default function NoLayout({ children }) {
  return <>{children}</>
}