const SuccessSkeleton = () => {
  return (
    <div
      className="bg-gradient-to-br from-green-50 to-green-100 px-6 py-20
      text-center h-screen flex flex-col items-center justify-center
      min-h-[60vh] space-y-6 animate-pulse"
    >
      <div
        className="w-20 h-20 rounded-full
        bg-gradient-to-br from-green-200 to-green-300"
      />
      <div
        className="h-10 w-[90%] max-w-150 rounded-md
        bg-gradient-to-br from-green-200 to-green-300"
      />
      <div className="space-y-8 w-full flex flex-col items-center">
        <div
          className="h-6 w-48 rounded
          bg-gradient-to-br from-green-200 to-green-300"
        />
        <div
          className="h-10 w-64 rounded
          bg-gradient-to-br from-green-200 to-green-300"
        />
        <div
          className="h-20 w-[90%] max-w-150 rounded
          bg-gradient-to-br from-green-200 to-green-300"
        />
      </div>
      <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
        <div
          className="w-40 h-12 rounded-xl mt-8
          bg-gradient-to-br from-green-200 to-green-300"
        />
        <div
          className="w-40 h-12 rounded-xl mt-8
          bg-gradient-to-br from-green-200 to-green-300"
        />
      </div>
    </div>
  );
};

export default SuccessSkeleton;
