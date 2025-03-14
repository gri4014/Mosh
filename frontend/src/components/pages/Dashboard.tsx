import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Post {
  id: string;
  caption: string;
  imageUrls: string[];
  scheduledFor: Date;
  status: 'pending' | 'approved' | 'published';
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [reviewMode, setReviewMode] = useState(true);
  
  // TODO: In production, fetch from backend
  const [nextPost, setNextPost] = useState<Post>({
    id: '1',
    caption: 'Experience sustainable fashion like never before. Our new collection combines style with eco-consciousness. #SustainableFashion #EcoFriendly',
    imageUrls: ['https://placeholder.com/800x800'],
    scheduledFor: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
    status: 'pending'
  });

  const handleApprove = () => {
    // TODO: In production, send to backend
    setNextPost(prev => ({ ...prev, status: 'approved' }));
  };

  const handleEdit = () => {
    // TODO: Implement edit functionality
    console.log('Edit post:', nextPost.id);
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Dashboard</h1>
        <div className="controls">
          <label>
            <input
              type="checkbox"
              checked={reviewMode}
              onChange={(e) => setReviewMode(e.target.checked)}
            />
            Review posts before publishing
          </label>
          <button onClick={() => navigate('/settings')}>Settings</button>
        </div>
      </header>

      {reviewMode && nextPost && (
        <div className="next-post">
          <h2>Next Scheduled Post</h2>
          <div className="post-preview">
            <div className="post-images">
              {nextPost.imageUrls.map((url, index) => (
                <img key={index} src={url} alt={`Post image ${index + 1}`} />
              ))}
            </div>
            <div className="post-details">
              <p className="caption">{nextPost.caption}</p>
              <p className="schedule">
                Scheduled for: {nextPost.scheduledFor.toLocaleDateString()}
              </p>
              <div className="actions">
                <button onClick={handleApprove}>Approve</button>
                <button onClick={handleEdit}>Edit</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="status-section">
        <h3>Status</h3>
        <div className="status-info">
          <p>Next post scheduled for: {nextPost.scheduledFor.toLocaleDateString()}</p>
          <p>Review mode: {reviewMode ? 'Enabled' : 'Disabled'}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
