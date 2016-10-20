import React, { Component } from 'react';

export default (props) => {
	return (
		<svg {...props} role="img"><use xlinkHref={`/images/sprite.symbol.svg#${props.name}`}/></svg>
	);
};