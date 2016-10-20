import React, { Component } from 'react';

export default class Field extends Component {
	render () {

		var { width, height } = this.props;

		const strokeWidth = 2;

		const x = strokeWidth / 2;
		const y = strokeWidth / 2;

		width = width - strokeWidth;
		height = height - strokeWidth;

		return (
			<g className="pitch-area">

				<defs>
					<clipPath id="cut">
						<rect
							x={ x }
							y={ y + height * .16 }
							width={ width }
							height={ height - height * .16 * 2 }
							fill="red"
							/>
					</clipPath>
				</defs>

				<rect
					x={ x }
					y={ y }
					width={ width }
					height={ height }
					/>

				<rect
					x={ x + (width - width * .6) / 2 }
					y={ y }
					width={ width * .6 }
					height={ height * .16 }
					/>
				<rect
					x={ x + (width - width * .6) / 2 }
					y={ y + (height - height * .16) }
					width={ width * .6 }
					height={ height * .16 }
					/>

				<rect
					x={ x + (width - width * .3) / 2 }
					y={ y }
					width={ width * .3 }
					height={ height * .06 }
					/>
				<rect
					x={ x + (width - width * .3) / 2 }
					y={ y + (height - height * .06) }
					width={ width * .3 }
					height={ height * .06 }
					/>

				<line
					x1={ x }
					x2={ x + width }
					y1={ y + height / 2 }
					y2={ y + height / 2 }
					/>

				<circle
					cx={ x + width / 2 }
					cy={ y + height / 2 }
					r={ width * .14 }
					/>

				<circle
					cx={ x + width / 2 }
					cy={ x + height * 0.11 }
					r={ width * .14 }
					clipPath="url(#cut)"
					/>

				<circle
					cx={ x + width / 2 }
					cy={ x + height - height * 0.11 }
					r={ width * .14 }
					clipPath="url(#cut)"
					/>
			</g>
		)
	}
}