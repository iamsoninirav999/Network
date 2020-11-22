document.addEventListener('DOMContentLoaded',follow_unfollow);

function follow_unfollow(){


    const follow_button = document.querySelector('#follow');
    const unfollow_button = document.querySelector('#unfollow');
    var dox;
    
        try{
            if(follow_button){
                dox='follow';
            }
        }catch(e){}

        try{
            if(unfollow_button){
                dox='unfollow';
            }
        }catch(e){}
    
try{
    follow_button.addEventListener('click',()=>{
        follow_button.firstElementChild.innerHTML='UnFollow';
        follow_button.firstElementChild.className='btn btn-dark btn-sm';
        follower_count=parseInt(document.querySelector('#f_info').innerHTML.split(':')[1])+1;
        document.querySelector('#f_info').innerHTML=`Followers : ${follower_count}`
        follow_unfollow_person(dox)
    });
}catch(e){}
try{
    unfollow_button.addEventListener('click',()=>{
        unfollow_button.firstElementChild.innerHTML='Follow';
        unfollow_button.firstElementChild.className='btn btn-outline-dark btn-sm';
        follower_count=parseInt(document.querySelector('#f_info').innerHTML.split(':')[1])-1;
        document.querySelector('#f_info').innerHTML=`Followers : ${follower_count}`
        follow_unfollow_person(dox)
    });
}catch(e){}

    function follow_unfollow_person(dox){
            console.log(dox);
            //put request for follow 
            fetch(`/follow_unfollow/`,{
                method:'PUT',
                body:JSON.stringify({
                    'user':document.querySelector('#username').innerText.split('@')[1],
                    'follow_or_unfollow':dox
                    
                })
            })
            // window.location.reload(true);
            
    }

}