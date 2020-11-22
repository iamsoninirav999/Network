const post_button = document.querySelector('#post_button');

try{
    post_button.addEventListener('click', addPost);
}
catch(e){
    console.log(e);
}

function addPost(e){

    // e.preventDefault();

    const content=document.querySelector('#content');
    
    if(content.length==''){
        return ;
    }   

    fetch('posts/',{
        method:'POST',
        body:JSON.stringify({
            content:content.value
        })
    })
    .then(response=>response.json())
    .then(result => {
        console.log(result);
    })
    .catch(error => {
        console.log(error);
    })
    
}
