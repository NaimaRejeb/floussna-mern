const Loading = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary-600"></div>
        <p className="mt-4 text-lg font-medium text-gray-700">Chargement...</p>
        <p className="mt-2 text-sm text-gray-500 arabic-text">...جار التحميل</p>
      </div>
    </div>
  );
};

export default Loading;
