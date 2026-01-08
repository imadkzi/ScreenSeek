import React from 'react'
import Pagination from "@material-ui/lab/Pagination";
import { createTheme, MuiThemeProvider } from "@material-ui/core";

const cineFlex = createTheme({
    palette: {
      primary: {
        main: '#273963'
      }
    }
  });


export const CustomPagination = ({setPage, numOfPages = 15}) => {

    const handlePageChange = (page) => {
        setPage(page);
        window.scroll(0, 0);
    };
    

    return (
        <div className='pagination center'>
            <MuiThemeProvider theme={cineFlex}>
                <Pagination 
                onChange={(e) => handlePageChange(e.target.textContent)}
                count={numOfPages}
                color="primary"
                hideNextButton = "true"
                hidePrevButton = "true"
            />
            </MuiThemeProvider>
        </div>
    )
}
