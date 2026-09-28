export default function PostGrid({ children }) {
  return (
    <div className="mt-9 grid place-items-center gap-6 sm:mt-12 sm:grid-cols-2 sm:place-items-stretch lg:grid-cols-4">
      {children}
    </div>
  );
}
