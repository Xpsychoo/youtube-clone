import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AiFillHeart, AiFillLike, AiOutlineDislike, AiOutlineLike } from 'react-icons/ai';
import { BiCommentDetail } from 'react-icons/bi';
import { BsPinAngle } from 'react-icons/bs';
import { MdVerified } from 'react-icons/md';

import Avatar from '../CommonComponents/Avatar';
import { CommentSkeleton } from '../CommonComponents/Skeletons';
import { ErrorState, LoadMore } from '../CommonComponents/StateViews';
import { Linkified } from './VideoInfo';
import { formatCount, formatNumber, isVerified, pickImage } from '../../Utils/AppConstants';
import { usePaginatedApi } from '../../Utils/hooks';

const Comment = ({ comment }) => {
  const [expanded, setExpanded] = useState(false);
  const [liked, setLiked] = useState(false);

  const author = comment.author || {};
  const content = comment.content || '';
  const isLong = content.length > 320 || content.split('\n').length > 4;
  const votes = (Number(comment.stats?.votes) || 0) + (liked ? 1 : 0);
  const replies = Number(comment.stats?.replies) || 0;
  const channelHref = author.channelId ? `/channel/${author.channelId}` : null;

  const avatar = <Avatar src={pickImage(author.avatar)} name={author.title || '?'} size={40} />;

  return (
    <div className="comment">
      {channelHref ? <Link to={channelHref}>{avatar}</Link> : avatar}
      <div className="comment__body">
        {comment.isPinned && (
          <div className="comment__pinned"><BsPinAngle /> Pinned</div>
        )}
        <div className="comment__head">
          {channelHref ? (
            <Link to={channelHref} className={`comment__author ${author.isChannelOwner ? 'is-owner' : ''}`}>
              {author.title}
            </Link>
          ) : (
            <span className="comment__author">{author.title}</span>
          )}
          {isVerified(author.badges) && <MdVerified className="verified-icon" />}
          <span className="comment__time">{comment.publishedTimeText}</span>
        </div>

        <p className={`comment__text ${expanded ? '' : 'is-clamped'}`}>
          <Linkified text={content} />
        </p>
        {isLong && (
          <button className="text-btn comment__more" onClick={() => setExpanded(!expanded)}>
            {expanded ? 'Show less' : 'Read more'}
          </button>
        )}

        <div className="comment__actions">
          <button
            className="icon-btn icon-btn--sm"
            onClick={() => setLiked(!liked)}
            aria-pressed={liked}
            aria-label="Like comment"
          >
            {liked ? <AiFillLike /> : <AiOutlineLike />}
          </button>
          {votes > 0 && <span className="comment__votes">{formatCount(votes)}</span>}
          <button className="icon-btn icon-btn--sm" aria-label="Dislike comment">
            <AiOutlineDislike />
          </button>
          {comment.creatorHeart && (
            <span className="comment__heart" title="Liked by the creator"><AiFillHeart /></span>
          )}
          {replies > 0 && (
            <span className="comment__replies">
              <BiCommentDetail /> {formatCount(replies)} {replies === 1 ? 'reply' : 'replies'}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

const Comments = ({ videoId, total }) => {
  const { items, meta, loading, error, hasMore, loadMore, retry } = usePaginatedApi(
    `video/comments/?id=${videoId}`,
    'comments'
  );
  const count = meta?.totalCommentsCount ?? total;

  return (
    <div className="comments">
      <h2 className="comments__title">
        {count != null ? `${formatNumber(count)} Comments` : 'Comments'}
      </h2>

      {items.map((comment, i) => (
        <Comment key={comment.commentId || i} comment={comment} />
      ))}

      {loading && <CommentSkeleton count={items.length ? 2 : 5} />}

      {error && !items.length && <ErrorState error={error} onRetry={retry} compact />}

      {!loading && !error && !items.length && (
        <p className="comments__empty">No comments to show. Comments may be turned off for this video.</p>
      )}

      {items.length > 0 && (
        <LoadMore hasMore={hasMore} loading={loading} error={error} onLoadMore={loadMore} onRetry={retry} />
      )}
    </div>
  );
};

export default Comments;
