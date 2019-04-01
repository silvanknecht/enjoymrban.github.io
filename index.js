"use strict";
function approveDomains(opts, certs, cb) {
  console.log(opts);
  if (!/^(www\.)?silvanknecht\.ch$/.test(opts.domains)) {
    cb(new Error("no config found for '" + opts.domain + "'"));
    return;
  }

  opts.email = "knecht.silvan@gmail.com";
  opts.agreeTos = true;
  opts.domains = ["silvanknecht.ch", "www.silvanknecht.ch"];

  cb(null, { options: opts, certs: certs });
}
//require('greenlock-express')
var greenlock = require("greenlock-express").create({
  // Let's Encrypt v2 is ACME draft 11
  version: "draft-11",

  server: "https://acme-staging-v02.api.letsencrypt.org/directory",
  // Note: If at first you don't succeed, stop and switch to staging
  // https://acme-staging-v02.api.letsencrypt.org/directory

  // You MUST change these to valid domains
  // NOTE: all domains will validated and listed on the certificate
  approvedDomains: function(opts, certs, cb) {
    approveDomains(opts, certs, cb);
  },

  // You MUST have access to write to directory where certs are saved
  // ex: /home/foouser/acme/etc
  configDir: "~/.config/acme/",

  app: function(req, res) {
    console.log("app is running");
    require("./server.js")(req, res);
  }

  //, debug: true
});
var server = greenlock.listen(80, 443);
