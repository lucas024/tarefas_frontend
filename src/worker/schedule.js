import React, {useState, useEffect} from 'react';
import styles from './schedule.module.css'
import Paper from '@mui/material/Paper';
import {
  Scheduler,
  WeekView,
  Appointments,
  AppointmentForm,
  DateNavigator,
  Toolbar
} from '@devexpress/dx-react-scheduler-material-ui';
import { 
    ViewState, 
    EditingState,
    CurrentTimeIndicator, 
} from '@devexpress/dx-react-scheduler';
// import { appointments } from './apps'; //temp
import dayjs from 'dayjs';
import axios from 'axios';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import Select from 'react-select'
import { styled, alpha } from '@mui/material/styles';
import Notification from '../general/notification'
import _ from 'lodash';


const PREFIX = 'Demo';

const classes = {
  todayCell: `${PREFIX}-todayCell`,
  weekendCell: `${PREFIX}-weekendCell`,
  today: `${PREFIX}-today`,
  weekend: `${PREFIX}-weekend`,
};


const formatDayScaleDate = (date, options) => {
    const momentDate = dayjs(date);
    const { weekday } = options;
    return momentDate.locale("pt").format(weekday ? 'dddd' : 'D');
}

const StyledWeekViewTimeTableCell = styled(WeekView.TimeTableCell)(({ theme }) => ({
  [`&.${classes.todayCell}`]: {
    backgroundColor: alpha(theme.palette.primary.main, 0.1),
    '&:hover': {
      backgroundColor: alpha(theme.palette.primary.main, 0.14),
    },
    '&:focus': {
      backgroundColor: alpha(theme.palette.primary.main, 0.16),
    },
  },
  [`&.${classes.weekendCell}`]: {
    backgroundColor: alpha(theme.palette.action.disabledBackground, 0.04),
    '&:hover': {
      backgroundColor: alpha(theme.palette.action.disabledBackground, 0.04),
    },
    '&:focus': {
      backgroundColor: alpha(theme.palette.action.disabledBackground, 0.04),
    },
  },
}));



const DayScaleCell = ((
    { formatDate, ...restProps },
  ) => (
    <WeekView.DayScaleCell
      {...restProps}
      formatDate={formatDayScaleDate}
    />
))


////////////////////// SCHEDULE ////////////////////////////
const Schedule = (props) => {

  const [currentDate, setCurrentDate] = useState(new Date('2022-02-21'))
  const [reservations, setReservations] = useState([])
  const [workerWeekends, updateWorkerWeekends] = useState(true)
  const [form, setForm] = useState(false)
  const [currentSelection, setCurrentSelection] = useState(null)
  const [notification, setNotification] = useState(null)

  useEffect(() => {
    getReservations(["620def6c82b602dd0520e3c6"])
  }, [])

  const updateReservationHandler = () => {
    axios.post('http://localhost:5000/reservations/update', currentSelection).then(res => {
              getReservations(["620def6c82b602dd0520e3c6"])
          })
  }
  
  useEffect(() => {
    setCurrentSelection(null)
  }, [reservations])

  const setFormHandler = val => {
    setForm(val)
    if(!val){
      setCurrentSelection(null)
    }
      
  }

  const CommandButton = ({...props}) => {
    const {id} = props
    return (
      <AppointmentForm.CommandButton
        {...props}
        onExecute={() => {
          console.log(id)
          if(id === "saveButton"){
            updateReservationHandler()
          }
          setFormHandler(false)
        }}
      />
    )
  }



  const Appointment = ({
    data, children, style, ...restProps
  }) => (
    <Appointments.Appointment
      {...restProps}
      style={{
        ...style,
        backgroundColor: data.type===0?'#FFC107':'#64b5f6',
      }}
      onClick={() => {
        setCurrentSelection(data)
        setFormHandler(true)
      }}
    >
      {children}
    </Appointments.Appointment>
  );

  const getReservations = () => {
    // axios.get(`http://localhost:5000/reservations`, { params: {worker_id: "620a9935dd773b6c652adf99"} }).then(res => {
    //       console.log(res.data)
    //       setReservations(res.data)
    // })
  }
    
  const commitChanges = changes => {
    console.log("yoyo");
      console.log(changes);
  }
  
  const yesNoOptions = [
    { value: true, label:"Sim" },
    { value: false, label:"Não" }
  ]

  const BasicLayout = ({ onFieldChange, ...restProps }) => {
    const onStartChange = nextValue => {
      let obj = currentSelection
      let endObj = new Date(currentSelection.endDate)
      if(nextValue.getTime() < endObj.getTime()){
        obj.startDate = nextValue
        setCurrentSelection(obj)
        onFieldChange({ startDate: nextValue })
      }
    }

    const onEndChange = nextValue => {
      let obj = currentSelection
      let startObj = new Date(currentSelection.startDate)
      if(nextValue.getTime() > startObj.getTime()){
        obj.endDate = nextValue
        setCurrentSelection(obj)
        onFieldChange({ endDate: nextValue })
      }
    }

    const onNotasChange = nextValue => {
      let obj = currentSelection
      obj.notas = nextValue
      setCurrentSelection(obj)
      onFieldChange({ notas: nextValue })
    }
    return (
      <AppointmentForm.BasicLayout
        onFieldChange={onFieldChange}
        //onClick={(e) => console.log(e)}
        {...restProps}
      >
        {
          currentSelection?!currentSelection.cliente?
          <div>
            <AppointmentForm.Label
              text="Cliente"
              type="title"
            />
            <div className={styles.local} style={{display:"flex"}}>
              <span>Nome</span>
              <span>nome</span>
              <span>nome</span>
              <span>nome</span>
              <span>nome</span>
            </div>
          </div>
          :null:null
        }
        {
          currentSelection?currentSelection.localizacao?
          <div>
            <AppointmentForm.Label
              text="Localização"
              type="title"
              style={{marginTop:"20px"}}
            />
            <div className={styles.local} style={{display:"flex"}}>
              <LocationOnIcon sx={{fontSize: 15}}/>
              <span className={styles.textEd}>{currentSelection?currentSelection.localizacao:null}</span>
            </div>
          </div>
          :null:null
        }
        <AppointmentForm.Label
          text="Horário"
          type="title"
          style={{marginTop:"20px"}}
        />
        <div className={styles.horario}>
          <AppointmentForm.DateEditor
            className={styles.horarioWidget}
            value={currentSelection? currentSelection.startDate:null}
            onValueChange={onStartChange}
            readOnly={true}
          />
          <div className={styles.sep}>
            <span> - </span>
          </div>
          <AppointmentForm.DateEditor
            className={styles.horarioWidget}
            value={currentSelection? currentSelection.endDate:null}
            onValueChange={onEndChange}
            readOnly={true}
          />
        </div>
        <AppointmentForm.Label
          text="Notas"
          type="title"
          style={{marginTop:"10px"}}
        />
        <AppointmentForm.TextEditor
          value={currentSelection?currentSelection.notas:null}
          onValueChange={onNotasChange}
          placeholder="Notas"
          className={styles.textEd}
        />
      </AppointmentForm.BasicLayout>
    )
  }
  
  const Overlay = ({...props}) => {
    const {children} = props
    return (
      <AppointmentForm.Overlay
        {...props}
        onExecute={() => setFormHandler(false)}
        onClick={(e) => {
          if(e.target.classList.contains("css-i9fmh8-MuiBackdrop-root-MuiModal-backdrop"))
            setFormHandler(false)
        }}
      >
        {children}
      </AppointmentForm.Overlay>
    )
  }

  
  const TimeTableCell = (props) => {
    const { startDate } = props;
    const date = new Date(startDate);

    if (date.getDate() === new Date().getDate()) {
      return <StyledWeekViewTimeTableCell {...props} className={classes.todayCell} />;
    } if ((date.getDay() === 0 || date.getDay() === 6) && !workerWeekends) {
      return <StyledWeekViewTimeTableCell {...props} className={classes.weekendCell} />;
    } return <StyledWeekViewTimeTableCell {...props} onDoubleClick={() => {
      setFormHandler(true)}} />;
  }

  const updateWeekendsHandler = bool => {
    if(bool !== workerWeekends){
      if(bool){
        setNotification("Ao colocar SIM, está a tornar o seu horário aberto aos fins-de-semana, podendo receber pedidos de clientes para esta altura")
      }
      else{
        setNotification("Ao colocar NÃO, está a tornar o seu horário fechado aos fins-de-semana, não recebendo pedidos de clientes para esta altura")
      }
      updateWorkerWeekends(bool)
    }
  }

  const updateWorkerWeekendsHandler = bool => {
    let body = {
      worker_id : "620a9935dd773b6c652adf99",
      weekends : workerWeekends
    }
    if(bool){
      axios.post('http://localhost:5000/workers/updateWeekend', body).then(res => {
        console.log(res.data)
        setNotification(null)
      })
    }
    else{
      updateWorkerWeekends(!workerWeekends)
      setNotification(null)
    }
    
    
  }


  return (
    <div>
      <div className={styles.schedule}>
        <Paper>
            <Scheduler
            data={reservations}
            height={630}
            locale="pt-PT"
            firstDayOfWeek={1}
            >

            <EditingState
            onAppointmentChangesChange={() => console.log("yo")}
            />
            <ViewState
                currentDate={currentDate}
                onCurrentDateChange={curr => setCurrentDate(curr)}
            />
            <WeekView
                startDayHour={7}
                endDayHour={19}
                cellDuration={60}
                dayScaleCellComponent={DayScaleCell}
                timeTableCellComponent={TimeTableCell}
            />
            <Appointments
              appointmentComponent={Appointment}
              appointmentChanges={commitChanges}

            />

            <AppointmentForm
                textEditorComponent={() => null}
                labelComponent={() => null}
                basicLayoutComponent={BasicLayout}
                booleanEditorComponent={() => null}
                dateEditorComponent={() => null}     
                commandButtonComponent={CommandButton}
                visible={form}
                overlayComponent={Overlay}
            />
            <CurrentTimeIndicator/>
            <Toolbar />
            <DateNavigator />
            </Scheduler>
        </Paper>
        <div className={styles.fds}>
              <div className={styles.fds_title_flex}>
                <span className={styles.fds_title}>Fim-de-semana</span>
              </div>
              <Select 
                options = {yesNoOptions}
                isSearchable={false}
                value = {yesNoOptions.filter(option => option.value === workerWeekends)}
                onChange={value => {
                  updateWeekendsHandler(value.value)
              }}
              />
            </div>
      </div>
        {
          notification?
          <Notification
              val={notification}
              updateWorkerWeekends={bool => updateWorkerWeekendsHandler(bool)}
              />
          :null
        }
    </div>
  )
}

export default Schedule