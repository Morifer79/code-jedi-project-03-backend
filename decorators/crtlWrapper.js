// const ctrlWrapper = (ctrl) => {
//   return async (req, res, next) => {
//     try {
//       await ctrl(req, res, next);
//     } catch (error) {
//       next(error);
//     }
//   };
//   };
  
//   export default  ctrlWrapper;

const ctrlWrapper = ctrl => {
    const func = async(req, res, next) => {
        try {
            await ctrl(req, res, next);
        }
        catch(error) {
            next(error);
        }
    }

    return func;
}

export default ctrlWrapper;