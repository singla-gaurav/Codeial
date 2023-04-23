{
	// method to submit the form data for new post using ajax
	let createPost = function(){
		
		let newPostForm = $("#new-posts");
		
		newPostForm.submit(function(e){
			e.preventDefault();

			$.ajax({
				type: "post",
				url: "/posts/create",
				data: newPostForm.serialize(),
				success: function(data){
					let newPost = newPostDom(data.data.post);
					$("#display-post>ul").prepend(newPost);
					$("#post_content").val("")
					deletePost($(' .delete-post-button', newPost));
					like($(' .like-post-button', newPost));

					new Noty({
                        theme: 'relax',
                        text: "Post published!",
                        type: 'success',
                        layout: 'topRight',
                        timeout: 1500
                        
                    }).show();
				},
				error: function(error){
					console.log(error.responseText);
				}
			})
		})
	}

	// method to create a post in DOM

	let newPostDom = function(post){
		return $(`<li id="post-${ post._id }"> 
					<p>
						<small>
							<po>0</po> <a class="like-post-button" href="/likes/toggle/?id=${ post._id }&type=Post"><i class="fa-solid fa-thumbs-up"></i></a>
						</small>
						${ post.content }
						<small>
							<a class="delete-post-button" href="/posts/destroy/${ post._id }">X</a>
						</small>
						<br>
						<small>${ post.user.name }</small>
						<div class="post-comments">
							
							<form action="/comments/create" method="POST">
								<input type="text" name="content" placeholder="Add your comments here..." required id="comment-box">
								<input type="hidden" name="post" value="${ post._id }">
								<input type="submit" value="Add Comment" id="comment-button">
							</form> 
							
				
							<div class="post-comments-list">
								<ul id="post-comments-${ post._id }">
		
								</ul>
							</div>
						</div>
					</p>
					
				</li>`)
	}


	// method to delete a post from DOM
	let deletePost = function(deleteLink){
		$(deleteLink).click(function(e){
			e.preventDefault();
			// console.log($(deleteLink).prop("href"))
			$.ajax({
				type: "get",
				url: $(deleteLink).prop("href"),
				success: function(data){
					$(`#post-${data.data.post_id}`).remove();
					new Noty({
                        theme: 'relax',
                        text: "Post and associated Comments Deleted",
                        type: 'success',
                        layout: 'topRight',
                        timeout: 1500
                        
                    }).show();
				},
				error: function(error){
					console.log("Error", error.responseText)
				}
			})
		})
	}

	let like = function(likeLink){
		$(likeLink).click(function(e){
			e.preventDefault();
			$.ajax({
				type: "get",
				url: $(likeLink).prop("href"),
				success: function(data){
					if (data.data.type=="Post"){
						let ans=$(`#post-${data.data.id} po`).text(data.data.len);
					}else{
						let ans=$(`#comment-${data.data.id} co`).text(data.data.len);
					}
				},
				error: function(error){
					console.log("Error", error.responseText)
				}
			})
		})
	}


	let convertPostsToAjax = function(){	
        $('#display-post>ul>li').each(function(){
            let self = $(this);
            let deleteButton = $(' .delete-post-button', self);
            let likeButton = $(' .like-post-button', self);

			like(likeButton);
            deletePost(deleteButton);
        });
    }
	createPost();
	convertPostsToAjax();
}
