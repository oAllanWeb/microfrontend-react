import React, { useCallback, useEffect, useState } from "react";
import api from "../utils/api";
import {
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
	Button,
	Modal,
	Box,
	Typography,
	IconButton,
} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';


type Seller = {
	id: string | number,
	nome: string,
	email: string,

}

function ExempleList() {
	const [list, setList] = useState<Seller[] | never[]>([]);
	const [vendedor, setVendedor] = useState<Seller | null>(null);
	const [open, setOpen] = React.useState(false);
	const handleOpen = () => {
		setOpen(true);
	};
	const handleClose = () => {
		setOpen(false);
	};
	const getList = useCallback(async () => {
		const { data } = await api.get("vendedores");
		console.log(data);
		if (data) {
			setList(data);
		}
	}, []);
	useEffect(() => {
		getList();
	}, [getList]);

	const handleDelete = async (idVendedor: any) => {
		const { data } = await api.delete(`vendedores/${idVendedor}`);
		if (data) {
			handleClose();
			window.location.reload();
		}
	};

	return (
		<>
			<h1>Teste fup</h1>
			<TableContainer component={Paper}>
				<Table aria-label="simple table">
					<TableHead>
						<TableRow>
							<TableCell>ID</TableCell>
							<TableCell>Nome</TableCell>
							<TableCell>E-mail</TableCell>
							<TableCell></TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{list.length > 0 &&
							list.map((item) => (
								<TableRow key={item.id}>
									<TableCell>{item.id}</TableCell>
									<TableCell>{item.nome}</TableCell>
									<TableCell>{item.email}</TableCell>
									<TableCell>
										<IconButton aria-label="delete" color="error" size="large" onClick={() => {
											setVendedor(item);
											handleOpen();
										}}
										>

											<DeleteIcon />
										</IconButton>

									</TableCell>
								</TableRow>
							))}
					</TableBody>
				</Table>
			</TableContainer >
			<Modal
				open={open}
				onClose={handleClose}
				aria-labelledby="modal-modal-title"
				aria-describedby="modal-modal-description"
				sx={{ justifyContent: 'center', alignItems: 'center' }}
			>
				<Box sx={{ width: 400 }}>
					<Paper elevation={5}>
						<Box>
							<Typography variant="h6" component="h2">
								Excluir Vendedor!
							</Typography>
							<Box>
								<Typography>
									Deseja excluir o vendedor: <strong>{vendedor?.nome}</strong>
								</Typography>
							</Box>
							<Box width="100%" justifyItems={"end"}>
								<Button
									type="button"
									color="primary"
									onClick={() => handleDelete(vendedor?.id)}
								>
									Excluir
								</Button>
							</Box>
						</Box>
					</Paper>
				</Box>
			</Modal>
		</>
	);
}

export default ExempleList;
