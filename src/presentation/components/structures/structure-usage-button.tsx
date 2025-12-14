"use client";

import { useState } from "react";
import { 
  Modal, 
  Table, 
  Badge, 
  Text, 
  Group, 
  Loader, 
  ActionIcon, 
  Tooltip 
} from "@mantine/core";
import { Eye } from "lucide-react";
import { structuresApi } from "@/src/infrastructure/api/structures.api"; 
import { formatDate } from "@/src/presentation/utils"; 

interface UsageData {
  projectId: string;
  projectName: string;
  clientName: string;
  quantity: number;
  status: string;
  dateEnd: string;
}

interface Props {
  structureId: string;
  structureName: string;
}

const statusColors: Record<string, string> = {
  ACTIVE: "blue",
  IN_PROCESS: "orange",
  FINISHED: "green",
  BUDGET: "gray",
  DELETED: "red",
};

const statusLabels: Record<string, string> = {
  ACTIVE: "Activo",
  IN_PROCESS: "En Proceso",
  FINISHED: "Finalizado",
  BUDGET: "Presupuesto",
  DELETED: "Eliminado"
};

export function StructureUsageButton({ structureId, structureName }: Props) {
  const [opened, setOpened] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<UsageData[]>([]);

  const handleOpen = async () => {
    setOpened(true);
    setLoading(true);
    
    try {
        const result = await structuresApi.getUsage(structureId);

        if (Array.isArray(result)) {
            setData(result);
        } else {
            setData([]);
        }
    } catch (error) {
      console.error("Error cargando uso de estructura", error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Tooltip label="Ver asignaciones">
        <ActionIcon variant="light" color="blue" onClick={handleOpen} mr="xs">
            <Eye size={16} />
        </ActionIcon>
      </Tooltip>

      <Modal 
        opened={opened} 
        onClose={() => setOpened(false)} 
        title={`Proyectos que utilizan a : ${structureName}`}
        size="lg"
        centered
        styles={{
            header: { backgroundColor: "#1a1a1a", color: "white", borderBottom: "1px solid #2d2d2d" },
            body: { backgroundColor: "#1a1a1a", padding: "20px" },
            content: { backgroundColor: "#1a1a1a", border: "1px solid #2d2d2d" },
            close: { color: "white", '&:hover': { backgroundColor: "#2d2d2d" } }
        }}
      >
        {loading ? (
            <Group justify="center" p="xl">
                <Loader color="blue" type="dots" />
            </Group>
        ) : data.length === 0 ? (
            <Text c="dimmed" ta="center" py="xl" fs="italic">
                Esta estructura no está asignada a ningún proyecto activo.
            </Text>
        ) : (
            <Table striped highlightOnHover withTableBorder>
                <Table.Thead>
                    <Table.Tr>
                        <Table.Th style={{ color: "#9ca3af" }}>Cliente / Evento</Table.Th>
                        <Table.Th style={{ color: "#9ca3af" }}>Estado</Table.Th>
                        <Table.Th style={{ color: "#9ca3af" }}>Fin Previsto</Table.Th>
                        <Table.Th style={{ color: "#9ca3af", textAlign: "right" }}>Cant.</Table.Th>
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                    {data.map((item) => (
                        <Table.Tr key={item.projectId}>
                            <Table.Td>
                                <Text size="sm" c="white" fw={500}>{item.clientName}</Text>
                                <Text size="xs" c="dimmed">{item.projectName}</Text>
                            </Table.Td>
                            <Table.Td>
                                <Badge color={statusColors[item.status] || "gray"} size="sm" variant="light">
                                    {statusLabels[item.status] || item.status}
                                </Badge>
                            </Table.Td>
                            <Table.Td>
                                <Text size="sm" c="#9ca3af">{formatDate(item.dateEnd)}</Text>
                            </Table.Td>
                            <Table.Td style={{ textAlign: "right" }}>
                                <Badge color="orange" size="md" variant="filled">
                                    {item.quantity}
                                </Badge>
                            </Table.Td>
                        </Table.Tr>
                    ))}
                </Table.Tbody>
            </Table>
        )}
      </Modal>
    </>
  );
}