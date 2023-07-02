import {
	Card,
	CardActionArea,
	CardActions,
	CardContent,
	CardMedia,
	Grid,
	Typography,
} from '@mui/material';
import CustomCardProps from './custom-card-props';

export default function CustomCard({
	imgSrc,
	title,
	description,
	children,
	defaultAction,
}: CustomCardProps) {
	return (
		<Grid item>
			<Card sx={{ maxWidth: 345 }}>
				<CardActionArea onClick={defaultAction}>
					<CardMedia
						component="img"
						image={imgSrc ? imgSrc : 'src/assets/image-placeholder.png'}
						alt="green iguana"
						sx={{ maxWidth: '100%', maxHeight: '100%', p: 1 }}
						style={{ fill: '' }}
					/>
					<CardContent sx={{ p: 1 }}>
						{title && (
							<Typography gutterBottom variant="h5" component="div">
								{title}
							</Typography>
						)}
						{description && (
							<Typography variant="body2" color="text.secondary">
								{description}
							</Typography>
						)}
					</CardContent>
				</CardActionArea>
				{children && (
					<CardActions sx={{ display: 'flex', justifyContent: 'flex-end' }}>{children}</CardActions>
				)}
			</Card>
		</Grid>
	);
}
