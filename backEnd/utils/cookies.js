const express = require("express");

function setJwtCookie(res, jwtToken) {
  res.cookie("jwtToken", jwtToken, {
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  }); // 7 days
}

module.exports = {
  setJwtCookie,
};
