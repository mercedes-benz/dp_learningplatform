const get = (name) => {
  const cname = `${name}=`;
  const ca = document.cookie.split(";");

  for(let i = 0; i < ca.length; i++) {
    let c = ca[i];

    while(c.charAt(0) === ' ') {
      c = c.substring(1);
    }

    if(c.indexOf(cname) === 0) {
      return c.substring(cname.length, c.length);
    }
  }

  return "";
};

const set = (name, value, exp_days = 1, path = "/") => {
  const d = new Date();
  d.setTime(d.getTime() + (exp_days * 24 * 60 * 60 * 1000));

  document.cookie = `${name}=${value};expires=${d.toUTCString()};path=${path}`
};

const remove = (name, path = "/") => {
  const d = new Date(0);

  document.cookie = `${name}=;expires=${d.toUTCString()};path=${path}`
}

export default {get, set, remove};
