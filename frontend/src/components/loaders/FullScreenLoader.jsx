const FullScreenLoader = ({ logoPhase }) => {
    return (
      <div className="fixed top-0 left-0 w-screen h-screen z-[9999] flex items-center justify-center bg-[#161916]">
        <div className="flex flex-col items-center gap-10">
  
          <div className="h-48 flex items-center justify-center">
            <img
              src={
                logoPhase === 0
                  ? "https://img1.wsimg.com/isteam/ip/a2f03483-d0cb-48fa-a888-7b79b29780e7/logo_ON_IT_stacked_white_TM_version.png"
                  : "https://img1.wsimg.com/isteam/ip/a2f03483-d0cb-48fa-a888-7b79b29780e7/logogodaddy.png"
              }
              className={`animate-pulse transition-all duration-700 ${
                logoPhase === 0 ? "h-44" : "h-16"
              }`}
            />
          </div>
  
          <div className="w-64 h-1 bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#FD4E59] transition-all duration-1000"
              style={{ width: logoPhase === 0 ? "40%" : "100%" }}
            />
          </div>
  
        </div>
      </div>
    );
  };
  
  export default FullScreenLoader;
  