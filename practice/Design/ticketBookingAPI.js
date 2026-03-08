//

// ******* Requirment**********

// Requirements
// CoreEntities
// API Interface
// Dataflow
// HLD
// Deep Dives

//Requirement
// /login  ---> based on input this will create a new session in the database and respond back to UI with session id and redirect URL,
// /logout ---> expire the session and delete the cookie

//  POST /v1/login;

const payload = {
  username: "",
  password: "",
  device_id: 1921,
};

response = {
  status: "success",
  status_code: 201,
  redirects: "/dashboard",
};

// POST /v1/logout;

const logOutPayload = {
  device_id: 1921,
};


POST /v1/logout
SetCookie: session_id:null, 
res = {
  status: "success",
  message: "logout successful",
};
