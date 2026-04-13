async function loadCourses(){
  const res = await fetch('https://droid-alpha-academy.onrender.com/api');
  const data = await res.json();
  console.log(data);
}
