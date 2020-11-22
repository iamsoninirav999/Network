document.addEventListener('DOMContentLoaded',getPost);


function getPost(){

// fetch(`/posts`)
// console.log(`/posts/`+window.location.search);

//for page numbers

fetch(`/posts/`+window.location.search)
.then(re=>re.json())
.then(d => {
    // console.log(document.getElementById('current_page').innerHTML);
    // console.log(d[d.length-1].current_page)
    c_page=d[d.length-1].current_page; //current page number
    next_page=parseInt(c_page)+1; //next page
    p_page=parseInt(c_page)-1;//previous page
    l_page=d[d.length-1].last_page_number
    document.getElementById('current_page').innerHTML=c_page;
    document.querySelector('#current_page').href=`?page=${c_page}`;
    document.querySelector('#last').href=`?page=${l_page}`;

    if(c_page==l_page){
        document.querySelector('#last').style.display='none';
    }

    if(c_page==1){
        document.getElementById('first').style.display='none';
        document.getElementById('previous').style.display='none';
    }
    
    if(!d[d.length-1].has_next){
        document.querySelector('#next').style.display='none';
    }
    document.querySelector('#next').href=`?page=${next_page}`

    if(d[d.length-1].has_previous){
        document.querySelector('#previous').href=`?page=${p_page}`
    }

})




fetch(`/posts/`+window.location.search)
.then(re=>re.json())
.then(d => {
    d.forEach(element=>{
        
        var item = document.createElement('div');
        item.innerHTML=`
        <div class="card mt-3" style="margin-left:230px; margin-right:230px;">
        <div class="card-body">
            <a href="profile/${element.user}">
                <h6 class="card-subtitle mb-2">@${element.user}</h6>
            </a>
            <div class="card-text">${element.content}</div>
            <p class="card-subtitle mb-1 mt-1 text-muted " >${element.time}</p>
        </div>
        </div>
        `;
        //d[d.length-1].loggedin_user  <-- current logged in user
        if(element.user == d[d.length-1].loggedin_user){
            var edit_button=document.createElement('div');
            edit_button.innerHTML=`
            <a href="javascript:void(0);"><button class="btn btn-sm btn-outline-dark ">Edit</button></a>
            `;
        }

        var like_part = document.createElement('div');
        like_part.className=`row ml-1`;
        let liked=false;
        
        //will give error for last element but it won't affect our application
        element.liked_by.forEach(data=>{
            if(data == d[d.length-1].loggedin_user){
                liked=true;
            }
        });

        if(liked){
            like_part.innerHTML=`
            <a href="javascript:void(0);"><span id="like" class="material-icons mt-1" style="font-size:29px;color:red;">favorite</span></a>
            <p class="ml-1">${element.like_count}</p>
            `; 
        }
        else{
            like_part.innerHTML=`
            <a href="javascript:void(0);"><span id="like" class="material-icons mt-1" style="font-size:29px; color:black;">favorite_border</span></a>
            <p class="ml-1 mt-1">${element.like_count}</p>
            `;
        }

    if(edit_button){

        item.firstElementChild.firstElementChild.appendChild(edit_button);

    }

    document.querySelector('#posts').appendChild(item);
    item.firstElementChild.firstElementChild.appendChild(like_part);
    
    var buttom=document.createElement('button');
    buttom.className='btn btn-sm btn-light';
    buttom.value='Edit';

    // console.log(item.firstElementChild.firstElementChild.firstElementChild.insertAdjacentHTML(buttom));

   

    //try - catch because if post is not created by loggedin user than will give an error 
    try{
        edit_button.addEventListener("click",()=>editPost(element.id,element.content));
    }
    catch(e){
        // console.log(e);
    }

    like_part.addEventListener('click',() => {
        if(liked){
            like_part.firstElementChild.firstElementChild.innerHTML='favorite_border';
            like_part.firstElementChild.firstElementChild.style.color='black';
            n=like_part.lastElementChild.innerHTML;
            like_part.lastElementChild.innerHTML=parseInt(n)-1;
        }
        if(!liked){
            like_part.firstElementChild.firstElementChild.innerHTML='favorite';
            like_part.firstElementChild.firstElementChild.style.color='red';
            n=like_part.lastElementChild.innerHTML;
            like_part.lastElementChild.innerHTML=parseInt(n)+1;
        }
        like_unlike_post(element.id,liked,d[d.length-1])
    });


    });
})

}


function editPost(post_id,post_content){
    window.scrollTo(0,0);
    document.querySelector('#content').value=post_content;
   
    document.querySelector('#post_button').style.display='none';
    document.querySelector('#edit_button').style.display='block';

    document.querySelector('#edit_button').addEventListener('click',function(){
        fetch(`posts/${post_id}`,{
            method:'PUT',
            body:JSON.stringify({
                content: document.querySelector('#content').value
            })
        })
    })

}

async function like_unlike_post(post_id,liked,user){

    // console.log(post_id,liked);
    

    const res=await fetch(`like_unlike/${post_id}`,{
        method:'PUT',
        body:JSON.stringify({
            'liked':liked,
            'user':user.loggedin_user
        })
    })

    // location.reload();
}