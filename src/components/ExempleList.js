import { useCallback, useEffect, useState } from 'react';
import api from '../utils/api';
import {
  Table,
  TableBody,
  TableHeader,
  TableColumn,
  TableRow,
  TableCell,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from '@nextui-org/react';

function ExempleList() {
  const [list, setList] = useState([]);
  const [vendedor, setVendedor] = useState({});
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();
  const getList = useCallback(async () => {
    const { data } = await api.get('vendedores');
    console.log(data);
    if (data) {
      setList(data);
    }
  }, []);
  useEffect(() => {
    getList();
  }, [getList]);

  const handleDelete = async (idVendedor) => {
    const { data } = await api.delete(`vendedores/${idVendedor}`);
    if (data) {
      onClose();
      window.location.reload();
    }
  };

  return (
    <>
      <Table data-testid="lista-vendedor" aria-label="Example empty table">
        <TableHeader>
          <TableColumn>ID</TableColumn>
          <TableColumn>Nome</TableColumn>
          <TableColumn>E-mail</TableColumn>
          <TableColumn></TableColumn>
        </TableHeader>
        <TableBody>
          {list.length > 0 &&
            list.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.id}</TableCell>
                <TableCell>{item.nome}</TableCell>
                <TableCell>{item.email}</TableCell>
                <TableCell>
                  <Button
                    onClick={() => {
                      setVendedor(item);
                      onOpen();
                    }}
                    color="danger"
                  >
                    Excluir
                  </Button>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        isDismissable={false}
        isKeyboardDismissDisabled={true}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Excluir Vendedor!
              </ModalHeader>
              <ModalBody>
                <p>
                  Deseja excluir o vendedor: <strong>{vendedor.nome}</strong>
                </p>
              </ModalBody>
              <ModalFooter>
                <Button
                  color="primary"
                  onPress={() => handleDelete(vendedor.id)}
                >
                  Excluir
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

export default ExempleList;
