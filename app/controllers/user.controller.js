exports.allAccess = (req, res) => {
  res.status(200).send("contenu public");
};

exports.userBoard = (req, res) => {
  res.status(200).send("utilisateur.");
};

exports.adminBoard = (req, res) => {
  res.status(200).send("Admin .");
};

exports.moderatorBoard = (req, res) => {
  res.status(200).send("Moderateur.");
};
