import React from "react";
import { Pagination } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";

const cineFlex = createTheme({
  palette: {
    primary: {
      main: "#273963",
    },
  },
});

export const CustomPagination = ({ setPage, numOfPages = 15 }) => {
  const handlePageChange = (event, value) => {
    setPage(value);
    window.scroll(0, 0);
  };

  return (
    <div className="pagination center">
      <ThemeProvider theme={cineFlex}>
        <Pagination
          onChange={handlePageChange}
          count={numOfPages}
          color="primary"
          hideNextButton
          hidePrevButton
        />
      </ThemeProvider>
    </div>
  );
};
