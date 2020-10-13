import React from 'react';

export default class HandleError extends React.Component{
    state = {
        hasError: false,
    }

    static getDerivedStateFromError(error){
        return {hasError: true};
    }

    render(){
        if(this.state.hasError){
            return(
                <h2>An Error has occurred and this page could not load. Please try again later.</h2>
            )
        }

        return this.props.children;
        
    }


}