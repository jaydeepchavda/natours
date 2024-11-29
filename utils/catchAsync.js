module.exports = fn => {
    return (res,req, next)=>{
        fn(req,res,next).catch(next);
    }
}