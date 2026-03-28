export const isEmailValid =(email) =>{
    email = email.trim();
    var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
}