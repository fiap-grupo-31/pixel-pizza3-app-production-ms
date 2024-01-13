export const Global = {
  error: function (data: string | null, statusCode?: any): object {
    if (data === null) {
      return {
        statusCode: statusCode || 200,
        status: 'success',
        data: []
      };
    }
    return {
      statusCode: statusCode || 404,
      status: 'error',
      message: data
    };
  },
  success: function (data: Object | null): object {
    if (data === null) {
      return {
        statusCode: 200,
        status: 'success',
        data: []
      };
    }
    return {
      statusCode: 200,
      status: 'success',
      data
    };
  },
  convertToObject: function (data: any): any {
    if (data === null) {
      return {};
    }

    try {
      const dataConvert = JSON.parse((data));
      return dataConvert || {};
    } catch (error) {
      return {};
    }
  },
  formatISOWithTimezone: (date: Date) => {
    const offset = -date.getTimezoneOffset();
    const offsetHours = String(Math.floor(offset / 60)).padStart(2, '0');
    const offsetMinutes = String(offset % 60).padStart(2, '0');
    const offsetSign = offset >= 0 ? '-' : '+';
    const isoDate = date.toISOString().replace('Z', '');

    return `${isoDate}${offsetSign}${offsetHours}:${offsetMinutes}`;
  }

};
