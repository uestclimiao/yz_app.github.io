#! /usr/bin/env python
# coding=utf-8
import datetime

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


