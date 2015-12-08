#! /usr/bin/env python
# coding=utf-8
import datetime

def date_cn_to_num(cn_str):
    if cn_str == u'一月':
        return '01'
    elif cn_str == u'二月':
        return '02'
    elif cn_str == u'三月':
        return '03'
    elif cn_str == u'四月':
        return '04'
    elif cn_str == u'五月':
        return '05'
    elif cn_str == u'六月':
        return '06'
    elif cn_str == u'七月':
        return '07'
    elif cn_str == u'八月':
        return '08'
    elif cn_str == u'九月':
        return '09'
    elif cn_str == u'十月':
        return '10'
    elif cn_str == u'十一月':
        return '11'
    else:
        return '12'

def get_age(year, month, day):
    try:
        born = datetime.date(int(year), int(month), int(day))
        today = datetime.date.today()
        try:
            birthday = born.replace(year=today.year)
        except ValueError:  # raised when birth date is February 29 and the current
            birthday = born.replace(year=today.year, day=born.day-1)
        if birthday > today:
            return today.year - born.year -1
        else:
            return today.year - born.year
    except:
        return -1