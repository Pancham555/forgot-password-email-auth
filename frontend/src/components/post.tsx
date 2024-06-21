import React, { useEffect, useState } from "react";
import { EllipsisVertical, Star, SendHorizonal } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import axios from "axios";

interface PostTypes {
  _id: string;
  username: string;
  post: string;
  likes: number;
  likedby: string[];
  comments: CommentTypes[];
  key: number;
}

interface CommentTypes {
  _id: string;
  username: string;
  comment: string;
}

const Post = ({ _id, username, post, likes, likedby, comments }: PostTypes) => {
  axios.defaults.withCredentials = true;
  const [showComments, setShowComments] = useState(false);
  const [comment, setComment] = useState<string>();
  const [like, setLike] = useState(false);
  const getLocalUsername = localStorage.getItem("username");

  const likePost = async () => {
    try {
      axios.defaults.withCredentials = true;
      const like = await axios.put(
        process.env.NEXT_PUBLIC_BACKEND_URL + "/api/posts/like",
        {
          _id,
        }
      );

      if (like.status === 200) {
        setLike(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const unlikePost = async () => {
    try {
      const unlike = await axios.patch(
        process.env.NEXT_PUBLIC_BACKEND_URL + "/api/posts/like",
        {
          _id,
        }
      );

      if (unlike.status === 200) {
        setLike(false);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const checkLikes = async () => {
    try {
      const checkForLikes = await axios.get(
        process.env.NEXT_PUBLIC_BACKEND_URL + `/api/posts?_id=${_id}`
      );

      if (await checkForLikes.data.post.likedby.includes(getLocalUsername)) {
        setLike(true);
      } else {
        setLike(false);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const editPost = async () => {
    try {
      const updatedPost = prompt("Update you post!");
      const edit = await axios.put(
        process.env.NEXT_PUBLIC_BACKEND_URL + "/api/posts",
        {
          post: updatedPost,
          _id,
        }
      );

      if (edit.status === 200) {
        alert("Post updated");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const deletePost = async () => {
    try {
      const delete_post = await axios.patch(
        process.env.NEXT_PUBLIC_BACKEND_URL + "/api/posts",
        {
          _id,
        }
      );

      if (delete_post.status === 200) {
        alert("Post has been deleted");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const addComment = async () => {
    try {
      const add_comment = await axios.post(
        process.env.NEXT_PUBLIC_BACKEND_URL + "/api/posts/comment",
        {
          _id,
          comment,
        }
      );

      if (add_comment.status === 200) {
        alert(add_comment.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    checkLikes();
  }, [like]);

  return (
    <div>
      <Card className="w-full">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>@{username}</CardTitle>
            <DropdownMenu>
              {username !== getLocalUsername ? null : (
                <DropdownMenuTrigger>
                  <EllipsisVertical className="h-5 w-5" />
                </DropdownMenuTrigger>
              )}
              <DropdownMenuContent className="mr-12">
                <DropdownMenuItem onClick={() => editPost()}>
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => deletePost()}>
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent>
          <CardDescription>{post}</CardDescription>
        </CardContent>
        <CardFooter className="align-top">
          <div className="w-full">
            <div className="mb-2 flex gap-2 ">
              <Star
                onClick={() => {
                  if (!like) {
                    likePost();
                  } else {
                    unlikePost();
                  }
                }}
                className={`cursor-pointer ${
                  like ? "text-pink-500 fill-pink-500" : ""
                }`}
              />
              {/* {likes} */}
            </div>
            <p
              className="font-medium cursor-pointer"
              onClick={() => setShowComments(!showComments)}
            >
              {showComments ? "Hide Comments" : "Show Comments"}
            </p>
            <div className="border-b-2 mt-2 w-full"></div>
            {showComments && (
              <>
                <div className="mt-2 flex justify-between gap-2 items-center">
                  <Input
                    type="text"
                    placeholder="Add a comment!"
                    onChange={(e) => setComment(e.target.value)}
                  />
                  <Button variant="outline" onClick={() => addComment()}>
                    <SendHorizonal />
                  </Button>
                </div>
                <div className="w-full mt-2 flex flex-col gap-2">
                  {comments.map(
                    ({ username, comment }: CommentTypes, index) => {
                      return (
                        <Card key={index}>
                          <CardHeader>
                            <CardTitle>@{username}</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <CardDescription>{comment}</CardDescription>
                          </CardContent>
                        </Card>
                      );
                    }
                  )}
                </div>
              </>
            )}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Post;
