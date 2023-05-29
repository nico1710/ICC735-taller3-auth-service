import userModel from "./models/user.model.js";

export function authMiddleware (req, res, next) {
  const headers = req.headers;

  const apiKey = headers['apikey'];

  if (!apiKey) return res.status(403).send({error: "Need an apikey!"})

  userModel.findOne({apiKey}).exec(function (err, user){
    if(err) res.status(500).send({error: "An error has ocured"});
    if(!user) return res.status(403).send({error: "the apikey is invalid"})

    req.userId = user._id;
    next();
  });
}