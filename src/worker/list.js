import React, {useState, useEffect} from 'react'
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListSubheader from '@mui/material/ListSubheader';
import styles from './list.module.css'
import dayjs from 'dayjs';
import EuroIcon from '@mui/icons-material/Euro';


const ListW = () => {

    const [trabalhosMes, setTrabalhosMes] = useState([])
    const [trabalhosRest, setTrabalhosResto] = useState([])
    const [totalMes, setTotalMes] = useState(0)

    useEffect(() => {
        let mesAux = trabalhosTemp.filter((val) => {
            return (val.startTime.getMonth() === new Date().getMonth()
                    && val.startTime.getFullYear() === new Date().getFullYear())
        })
        let restAux = trabalhosTemp.filter((val) => {
            return val.startTime.getMonth() < new Date().getMonth()
        })
        setTrabalhosMes(mesAux.sort((firstEl, secondEl) => {
            return firstEl.startTime.getTime() > secondEl.startTime.getTime()
        }))
        setTrabalhosResto(restAux.sort((firstEl, secondEl) => {
            return firstEl.startTime.getTime() > secondEl.startTime.getTime()
        }))
        let totalAux = 0
        for(let el of mesAux){
            totalAux += el.valor
        }
        setTotalMes(totalAux * 0.95)
    }, [])

    const trabalhosTemp = [
        {
            startTime: new Date('2022-02-14'),
            endTime: new Date('2022-02-14'),
            valor: 255.32,
            pagamento: 0,
            reservation_id: "dfsj231238dfs"
        },
        {
            startTime: new Date('2022-02-22'),
            endTime: new Date('2022-02-22'),
            valor: 255.32,
            pagamento: 0,
            reservation_id: "dfsj231238dfs"
        },
        {
            startTime: new Date('2022-02-23'),
            endTime: new Date('2022-02-23'),
            valor: 255.32,
            pagamento: 0,
            reservation_id: "dfsj231238dfs"
        },
        {
            startTime: new Date('2022-01-1'),
            endTime: new Date('2022-01-1'),
            valor: 255.32,
            pagamento: 1,
            reservation_id: "dfsj231238dfs"
        },
        {
            startTime: new Date('2022-01-11'),
            endTime: new Date('2022-01-11'),
            valor: 134.32,
            pagamento: 2,
            reservation_id: "dfsj231238dfs"
        },

    ]

    const displayTrabalhosText = (t) => {
        return(
            <div className={t.pagamento===0?styles.list_itemPorPagar:t.pagamento===1?styles.list_itemPago:styles.list_itemCancelado}>
                <span className={styles.list_date}>
                    <span className={styles.alignCenter}>
                        {dayjs(t.startTime).format('DD/MM')}
                    </span>
                    
                </span>
                <span className={styles.alignCenter}>
                    <span className={styles.list_id}>
                        <span className={styles.list_id_txt}>#</span>
                        <span className={styles.list_id_id}>{t.reservation_id}</span>
                    </span>
                </span>
                <span className={styles.alignCenter}>
                    <span className={styles.detalhes_button}>
                        Detalhes
                    </span>
                </span>
                <span className={styles.alignCenter}>
                    {
                        t.pagamento===0?
                            <span className={styles.por_pagar}>
                                POR PAGAR
                            </span>:
                        t.pagamento===1?
                            <span className={styles.pago}>
                                PAGO
                            </span>
                        :
                            <span className={styles.cancelado}>
                                CANCELADO
                            </span>
                    }
                </span>
                <span className={styles.alignCenter}>
                    <span className={styles.valor}>
                        <EuroIcon sx={{fontSize: 10, marginTop:"5px"}}/>
                        <span className={
                            t.pagamento===0?
                                styles.valor_nm_por_pagar:
                            t.pagamento===1?
                                styles.valor_nm_pago:
                                styles.valor_nm_cancelado
                        }>{t.valor}</span>
                    </span>
                </span>
            </div>
        )
        
    }

    const displayTrabalhos = (type) => {
        if(type === 'mes'){
            return trabalhosMes.map((t, i) => {
                return (
                    <ListItem key={i} sx={{ pl: 1, padding:"0"}}>
                            {displayTrabalhosText(t)}                        
                    </ListItem>
                )
            })
        }
        else{
            return trabalhosRest.map((t, i) => {
                return (
                    <ListItem key={i} sx={{ pl: 1, padding:"0"}}>
                            {displayTrabalhosText(t)}                        
                    </ListItem>
                )
            })
        }
        
    }

    function nextWeekdayDate() {
        var ret = new Date(new Date());
        ret.setDate(ret.getDate() + (5 - 1 - ret.getDay() + 7) % 7 + 1);
        return ret;
      }
    
    return(
        <div className={styles.list}>
        <List
            sx={{ width: '100%', bgcolor: 'background.paper'}}
            component="nav"
            aria-labelledby="nested-list-subheader"
            className={styles.list_header}
            subheader={
                <ListSubheader component="div" id="nested-list-subheader" className={styles.header}>
                    Trabalhos relativos ao próximo pagamento
                    <span className={styles.total}>
                        <span className={styles.totalData}>Data próximo pagamento </span>
                        <span className={styles.totalDataShort}>Prox. pag. </span>
                        <span className={styles.totalDataValor}>{dayjs(nextWeekdayDate()).format('DD/MM')}</span>
                        <span className={styles.totalText}>Total por pagar </span>
                        <span className={styles.alignCenter}>
                            <EuroIcon sx={{fontSize: 10, color:"000"}}/>
                        </span>
                        <span className={styles.totalVal}>{parseFloat(totalMes).toFixed(2)}</span>
                    </span>
                </ListSubheader>
              }
        >
            <div style={{borderTop:"1px dashed #ccc", width:"100%"}}>
                {displayTrabalhos('mes')}
            </div>
        </List>

        <List
            sx={{ width: '100%', bgcolor: 'background.paper'}}
            component="nav"
            aria-labelledby="nested-list-subheader"
            className={styles.list_header}
            subheader={
                <ListSubheader component="div" id="nested-list-subheader">
                  Trabalhos anteriores
                </ListSubheader>
              }
        >
            <div style={{borderTop:"1px dashed #ccc", width:"100%"}}>
                {displayTrabalhos('anteriores')}
            </div>
        </List>
        </div>
    )
}

export default ListW