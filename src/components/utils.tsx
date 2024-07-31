import {motion} from "framer-motion";
import {SquareArrowOutUpRight} from "lucide-react";
import {ComponentType, useRef, useState} from "react";

//Spring animation parameters
const spring = {
	type: "spring",
	stiffness: 300,
	damping: 40,
}

export function withClick(ComponentA: any, ComponentB: any): ComponentType {
	return (props: any) => {
		const [isFlipped, setIsFlipped] = useState(false)
		
		const handleClick = () => {
			setIsFlipped((prevState) => !prevState)
		}
		
		const ref = useRef(null)
		
		return (
			<motion.div
				onClick={handleClick}
				transition={spring}
				style={{
					perspective: "1200px",
					transformStyle: "preserve-3d",
					width: `${props.width}`,
					height: `${props.height}`,
				}}
			>
				<motion.div
					ref={ref}
					transition={spring}
					style={{
						width: "100%",
						height: "100%",
					}}
				>
					<div
						style={{
							perspective: "1200px",
							transformStyle: "preserve-3d",
							width: "100%",
							height: "100%",
						}}
					>
						<motion.div
							animate={{rotateY: isFlipped ? -180 : 0}}
							transition={spring}
							style={{
								width: "100%",
								height: "100%",
								zIndex: isFlipped ? 0 : 1,
								backfaceVisibility: "hidden",
								position: "absolute",
							}}
						>
							<ComponentA
								{...props}
								variant="Front"
								style={{
									width: "100%",
									height: "100%",
								}}
							/>
						</motion.div>
						<motion.div
							initial={{rotateY: 180}}
							animate={{rotateY: isFlipped ? 0 : 180}}
							transition={spring}
							style={{
								width: "100%",
								height: "100%",
								zIndex: isFlipped ? 1 : 0,
								backfaceVisibility: "hidden",
								position: "absolute",
							}}
						>
							<ComponentB
								{...props}
								variant="Back"
								style={{
									width: "100%",
									height: "100%",
								}}
							/>
						</motion.div>
					</div>
				</motion.div>
			</motion.div>
		)
	}
}
