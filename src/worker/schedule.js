import React, {useState, useEffect} from 'react';
import styles from './schedule.module.css'
import Paper from '@mui/material/Paper';
import {
  Scheduler,
  WeekView,
  Appointments,
  AppointmentTooltip,
  AppointmentForm,
  DateNavigator,
  Toolbar
} from '@devexpress/dx-react-scheduler-material-ui';
import { 
    ViewState, 
    EditingState,
    CurrentTimeIndicator 
} from '@devexpress/dx-react-scheduler';
import { appointments } from './apps'; //temp
import dayjs from 'dayjs';
require('dayjs/locale/pt')


const formatDayScaleDate = (date, options) => {
    const momentDate = dayjs(date);
    const { weekday } = options;
    return momentDate.format(weekday ? 'dddd' : 'D');
};


const DayScaleCell = ((
    { formatDate, ...restProps },
  ) => (
    <WeekView.DayScaleCell
      {...restProps}
      formatDate={formatDayScaleDate}
    />
  ));
  const TextEditor = (props) => {
    return null
  };

  const BasicLayout = ({ onFieldChange, appointmentData, ...restProps }) => {
    const onCustomFieldChange = (nextValue) => {
      onFieldChange({ customField: nextValue });
    };
  
    return (
      <AppointmentForm.BasicLayout
        appointmentData={appointmentData}
        onFieldChange={onFieldChange}
        {...restProps}
      >
        {/* <AppointmentForm.Label
          text="Horário"
          type="ordinary"
          {...restProps}
        /> */}

        <AppointmentForm.TextEditor
          value={appointmentData.customField}
          onValueChange={onCustomFieldChange}
          placeholder="Notas"
          className={styles.textEd}
        />
      </AppointmentForm.BasicLayout>
    );
  };


const Schedule = (props) => {
    
    const [currentDate, setCurrentDate] = useState('2018-06-27')

    const commitChanges = changes => {
        console.log(changes);
    }
    
    return (
        <div className={styles.schedule}>
            <Paper>
                <Scheduler
                data={appointments}
                height={630}
                locale="pt-PT"
                >
                <EditingState
                    onCommitChanges={commitChanges}
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
                />
                <Appointments />
                <AppointmentTooltip
                    showOpenButton
                    showDeleteButton
                />
                <AppointmentForm
                    textEditorComponent={TextEditor}
                    labelComponent={() => null}
                    basicLayoutComponent={BasicLayout}
                    booleanEditorComponent={() => null}
                />
                <CurrentTimeIndicator/>
                <Toolbar />
                <DateNavigator />
                </Scheduler>
            </Paper>
        </div>
    )
}

export default Schedule