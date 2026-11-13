const email_regex =
  /^(?!\.)(?!.*\.\.)[a-zA-Z0-9._%+-]+(?<!\.)@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const mobile_regex = /^(09|\+639)\d{9}$/;

module.exports = { email_regex, mobile_regex };
