// This file is no longer used but kept to avoid breaking other imports if any.
// The toast functionality is now handled by `sonner` via `use-toast.ts` and `toaster.tsx`.
export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};
export const Toast = ({ children }: { children: React.ReactNode }) => {
  return <div>{children}</div>;
}
export const ToastClose = () => <button>Close</button>;
export const ToastDescription = ({ children }: { children: React.ReactNode }) => <p>{children}</p>;
export const ToastTitle = ({ children }: { children: React.ReactNode }) => <h4>{children}</h4>;
export const ToastViewport = () => <div />;
export type ToastProps = {};
export type ToastActionElement = any;
