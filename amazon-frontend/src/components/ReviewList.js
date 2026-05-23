import React from 'react'
import '../styles/ReviewList.css'

const ReviewList = ({product}) => {

    if (!product || !product.reviews || product.reviews.length === 0) {
        return (
            <div className="review-section">
                <h3>Customer Reviews</h3>
                <p className="no-reviews">No reviews yet. Be the first to review this product!</p>
            </div>
        )
    }

    return (
        <div className="review-section">
            <h3>Customer Reviews ({product.reviews.length})</h3>
            <div className="reviews-list">
                {product.reviews.map((review, index) => (
                    <div key={index} className="review-item">
                        <div className="review-header">
                            <strong>{review.name}</strong>
                            <span className="review-rating">
                                {'⭐'.repeat(review.rating)}
                                {review.rating < 5 && '☆'.repeat(5 - review.rating)}
                            </span>
                        </div>
                        <p className="review-date">{new Date(review.createdAt).toLocaleDateString()}</p>
                        <p className="review-comment">{review.comment}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default ReviewList
