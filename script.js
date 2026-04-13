async function loadCourses(){
  const res = await fetch('https://droid-alpha-academy.onrender.com/api/courses');
  const authRes = await fetch('https://droid-alpha-academy.onrender.com/api/auth/login');
  const data = await res.json();
  console.log(data);
}
