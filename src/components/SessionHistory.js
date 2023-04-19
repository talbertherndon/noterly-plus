import { getSetData } from "@/utils/api";
import { Box } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
export default function SessionHistory({ set }) {
  const [data, setData] = useState([]);
  useEffect(() => {
    getSetData(set.id).then((res) => {
      console.log(res);
      setData(res);
    });
  }, []);
  const columns = [
    {
      field: "name",
      headerName: "Name",
      width: 150,
      editable: false,
      valueGetter: (params) => `${params.row.user.name}`,
    },
    {
      field: "correct",
      headerName: "Correct",
      width: 100,
      editable: false,
      valueGetter: (params) => `${params.row.correct ? "Yes" : "No"}`,
    },
    {
      field: "question",
      headerName: "Question",
      width: 200,
      editable: "false",
      valueGetter: (params) => `${params.row.question.question}`,
    },
    {
      field: "answer",
      headerName: "Answer",
      width: 150,
      editable: "false",
      valueGetter: (params) => `${params.row.question.answer}`,
    },
    {
      field: "session",
      headerName: "Session",
      width: 200,
      editable: "false",
      valueGetter: (params) => `${params.row.session_id}`,
    },
  ];
  return (
    <Box>
      <Box sx={{ width: 700 }}>
        <DataGrid
          experimentalFeatures={{ newEditingApi: true }}
          checkboxSelection
          density="compact"
          components={{ Toolbar: GridToolbar }}
          columns={columns}
          autoHeight
          rows={data}
          pagination
          pageSize={10}
        />
      </Box>
    </Box>
  );
}
