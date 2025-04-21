import spinner from '../assets/loading.svg';

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/70 backdrop-blur-sm">
      <div className="animate-pulse p-6 rounded-full bg-white shadow-lg">
        <img src={spinner} alt="loading..." className="w-20 h-20" />
      </div>
    </div>
  );
}
