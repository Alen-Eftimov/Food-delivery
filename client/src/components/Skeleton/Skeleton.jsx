import React from 'react'
import './skeleton.scss'

const Skeleton = ({type}) => {  

    const COUNTER = 32

    const HeaderSkeleton = () => (
        <div className="headerSkeleton">
            <div className="headerSkeletonContainer">
                <div className="headerSkeletonItem"></div>
                <div className="headerSkeletonItem"></div>
                <div className="headerSkeletonItem"></div>
            </div>
        </div>
    )

    const ExploreMenuSkeleton = () => (
        <div className="exploreMenuSkeleton">
            {Array.from({ length: 8}, (_, index) => (
                <div className="exploreMenuSkeletonItem" key={index}>
                    <div className="exploreMenuSkeletonImg"></div>
                    <div className="exploreMenuSkeletonText"></div>
                </div>
            ))}
        </div>
    )

    const FoodDisplaySkeleton = () => (
        <div className="foodDisplaySkeleton">
            <div className="foodDisplaySkeletonItem" >
                <div className="foodDisplaySkeletonItemImg"></div>
                <div className="foodDisplaySkeletonInfo"></div>
            </div>
        </div>
    )

    if (type === "header") return <HeaderSkeleton />;
    if (type === "explore_menu") return <ExploreMenuSkeleton />
    if (type === "food_display") {
        return Array.from({length: COUNTER}, (_, index) => (
            <FoodDisplaySkeleton key={index} />
        ));
    }
    return null;
}

export default Skeleton