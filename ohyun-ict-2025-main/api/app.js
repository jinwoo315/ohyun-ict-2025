//https://crudcrud.com/api/4cab68ee13b84bd4aa33ef3e02b9c10c//

// fetch("https://crudcrud.com/api/4cab68ee13b84bd4aa33ef3e02b9c10c/post").then((res)=>{
// return res.json()
// }).then((json)=>{
//     console.log(json)
// })

//async function init(){}
const post_url = "https://crudcrud.com/api/4cab68ee13b84bd4aa33ef3e02b9c10c/post"
const init= async ()=>{
    const res = await fetch(post_url);
    const json= await res.json();
    console.log(json);
}
const write = async (data)=>{
    const res = await fetch(post_url,{
        method: "POST",
        headers:{
            "Content-Type":"application/json",
        },
        body:JSON.stringify(data)
    })
}

const submit=()=>{
    const title = document.querySelector("#title").value;
    const content = document.querySelector("#content").value;
    const data = {
        title:title,
        content:content
    }
    console.log(data)
    write(data);

}
document.querySelector("#post-form").addEventListener("submit",(e)=>{
    e.preventDefault()
    submit();
})

init()
